"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const sendEmail_1 = require("../utils/sendEmail");
const Contact_1 = __importDefault(require("../models/Contact"));
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const router = express_1.default.Router();
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
});
router.post('/', [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('service').isIn(['seo', 'social-media', 'ppc', 'content', 'email', 'other']).withMessage('Invalid service'),
    (0, express_validator_1.body)('message').notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        const { firstName, lastName, email, phone, service, message, company, website, budget, timeline } = req.body;
        let contact;
        try {
            contact = await Contact_1.default.create({
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
        }
        catch (dbError) {
            const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
            console.warn('Database save failed:', errorMessage);
            contact = {
                id: Date.now(),
                firstName,
                lastName,
                email,
                service,
                createdAt: new Date()
            };
        }
        try {
            await (0, sendEmail_1.sendContactNotification)({
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
        }
        catch (emailError) {
            console.error('Failed to send notification email:', emailError);
        }
        try {
            await (0, sendEmail_1.sendWelcomeEmail)({
                name: firstName,
                email
            });
        }
        catch (emailError) {
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
    }
    catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit contact form'
        });
    }
});
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const whereClause = {};
        if (search) {
            whereClause[sequelize_1.Op.or] = [
                { firstName: { [sequelize_1.Op.like]: `%${search}%` } },
                { lastName: { [sequelize_1.Op.like]: `%${search}%` } },
                { email: { [sequelize_1.Op.like]: `%${search}%` } },
                { company: { [sequelize_1.Op.like]: `%${search}%` } }
            ];
        }
        if (status) {
            whereClause.status = status;
        }
        const { count, rows } = await Contact_1.default.findAndCountAll({
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
    }
    catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact_1.default.findByPk(req.params.id);
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
    }
    catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.put('/:id', [
    (0, express_validator_1.body)('status').isIn(['new', 'replied', 'in-progress', 'closed']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        const contact = await Contact_1.default.findByPk(req.params.id);
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
    }
    catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/stats', async (req, res) => {
    try {
        const totalSubmissions = await Contact_1.default.count();
        const newSubmissions = await Contact_1.default.count({ where: { status: 'new' } });
        const repliedSubmissions = await Contact_1.default.count({ where: { status: 'replied' } });
        const inProgressSubmissions = await Contact_1.default.count({ where: { status: 'in-progress' } });
        const serviceStats = await Contact_1.default.findAll({
            attributes: [
                'service',
                [database_1.default.fn('COUNT', database_1.default.col('id')), 'count']
            ],
            group: ['service'],
            raw: true
        });
        const byService = {};
        serviceStats.forEach((stat) => {
            byService[stat.service] = parseInt(stat.count);
        });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentSubmissions = await Contact_1.default.count({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: thirtyDaysAgo
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
    }
    catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=contact.js.map