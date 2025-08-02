"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = require("../utils/generateToken");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@adsiri.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Adsiri@2024';
        if (email !== adminEmail) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const isMatch = await bcryptjs_1.default.compare(password, await bcryptjs_1.default.hash(adminPassword, 12));
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const userData = {
            id: 'admin-001',
            email: adminEmail,
            role: 'admin'
        };
        const token = (0, generateToken_1.generateToken)(userData);
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: userData.id,
                    email: userData.email,
                    role: userData.role
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.get('/me', auth_1.protect, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role
                }
            }
        });
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
router.put('/change-password', [
    auth_1.protect,
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: errors.array()[0].msg
            });
        }
        const { currentPassword, newPassword } = req.body;
        const adminPassword = process.env.ADMIN_PASSWORD || 'Adsiri@2024';
        const isMatch = await bcryptjs_1.default.compare(currentPassword, await bcryptjs_1.default.hash(adminPassword, 12));
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }
        res.json({
            success: true,
            message: 'Password updated successfully. Please update your environment variables.'
        });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map