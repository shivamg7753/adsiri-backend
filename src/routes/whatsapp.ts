import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @desc    Generate WhatsApp link
// @route   POST /api/whatsapp/generate-link
// @access  Public
router.post('/generate-link', [
  body('message').optional().isString().withMessage('Message must be a string')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { message } = req.body;
    const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '+919876543210';
    
    // Default message if none provided
    const defaultMessage = "Hi! I'm interested in your digital marketing services. Can we discuss my requirements?";
    const finalMessage = message || defaultMessage;

    // Generate WhatsApp link
    const whatsappLink = `https://wa.me/${whatsappPhoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(finalMessage)}`;

    res.json({
      success: true,
      data: {
        whatsappLink,
        phoneNumber: whatsappPhoneNumber,
        message: finalMessage
      }
    });
  } catch (error) {
    console.error('Generate WhatsApp link error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get default WhatsApp link
// @route   GET /api/whatsapp/link
// @access  Public
router.get('/link', async (req: Request, res: Response) => {
  try {
    const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '+919876543210';
    const defaultMessage = "Hi! I'm interested in your digital marketing services. Can we discuss my requirements?";
    
    const whatsappLink = `https://wa.me/${whatsappPhoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(defaultMessage)}`;

    res.json({
      success: true,
      data: {
        whatsappLink,
        phoneNumber: whatsappPhoneNumber,
        message: defaultMessage
      }
    });
  } catch (error) {
    console.error('Get WhatsApp link error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get WhatsApp configuration
// @route   GET /api/whatsapp/config
// @access  Public
router.get('/config', async (req: Request, res: Response) => {
  try {
    const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '+919876543210';
    
    res.json({
      success: true,
      data: {
        phoneNumber: whatsappPhoneNumber,
        status: 'ready',
        type: 'link-based'
      }
    });
  } catch (error) {
    console.error('Get WhatsApp config error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router; 