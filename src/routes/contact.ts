import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { sendContactNotification, sendWelcomeEmail } from '../utils/sendEmail';
import Contact from '../models/Contact';
import { Op } from 'sequelize';
import sequelize from '../config/database';

const router = express.Router();

// Handle preflight OPTIONS requests
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).end();
});

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('service').isIn(['seo', 'social-media', 'ppc', 'content', 'email', 'other']).withMessage('Invalid service'),
  body('message').notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      service,
      message,
      company,
      website,
      budget,
      timeline
    } = req.body;

    // Save to database
    let contact;
    try {
      contact = await Contact.create({
        firstName,
        lastName,
        email,
        phone,
        service,
        message,
        company,
        website,
        budget,
        timeline,
        status: 'new'
      });
    } catch (dbError) {
      console.warn('Database save failed:', dbError.message);
      // Create a mock contact object for response
      contact = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        service,
        createdAt: new Date()
      };
    }

    // Send notification email to admin (optional - can be disabled)
    try {
      await sendContactNotification({
        firstName,
        lastName,
        email,
        phone,
        service,
        message,
        company,
        website,
        budget,
        timeline,
        submittedAt: contact.createdAt
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }

    // Send welcome email to user (optional - can be disabled)
    try {
      await sendWelcomeEmail({
        name: firstName,
        email
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      data: {
        contact: {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          service: contact.service
        }
      }
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form'
    });
  }
});

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Contact.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: {
        contacts: rows,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get contact by ID (Admin only)
// @route   GET /api/contact/:id
// @access  Private
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update contact status (Admin only)
// @route   PUT /api/contact/:id
// @access  Private
router.put('/:id', [
  body('status').isIn(['new', 'replied', 'in-progress', 'closed']).withMessage('Invalid status')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const contact = await Contact.findByPk(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact not found'
      });
    }

    await contact.update({
      status: req.body.status
    });

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get contact form statistics (Admin only)
// @route   GET /api/contact/stats
// @access  Private
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalSubmissions = await Contact.count();
    const newSubmissions = await Contact.count({ where: { status: 'new' } });
    const repliedSubmissions = await Contact.count({ where: { status: 'replied' } });
    const inProgressSubmissions = await Contact.count({ where: { status: 'in-progress' } });

    // Get submissions by service
    const serviceStats = await Contact.findAll({
      attributes: [
        'service',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['service'],
      raw: true
    });

    const byService: any = {};
    serviceStats.forEach((stat: any) => {
      byService[stat.service] = parseInt(stat.count);
    });

    // Get recent submissions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSubmissions = await Contact.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    const stats = {
      totalSubmissions,
      newSubmissions,
      repliedSubmissions,
      inProgressSubmissions,
      recentSubmissions,
      byService
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router; 