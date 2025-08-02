"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/generate-link', [
    (0, express_validator_1.body)('message').optional().isString().withMessage('Message must be a string')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        const { message } = req.body;
        const whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '+919876543210';
        const defaultMessage = "Hi! I'm interested in your digital marketing services. Can we discuss my requirements?";
        const finalMessage = message || defaultMessage;
        const whatsappLink = `https://wa.me/${whatsappPhoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(finalMessage)}`;
        res.json({
            success: true,
            data: {
                whatsappLink,
                phoneNumber: whatsappPhoneNumber,
                message: finalMessage
            }
        });
    }
    catch (error) {
        console.error('Generate WhatsApp link error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/link', async (req, res) => {
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
    }
    catch (error) {
        console.error('Get WhatsApp link error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/config', async (req, res) => {
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
    }
    catch (error) {
        console.error('Get WhatsApp config error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=whatsapp.js.map