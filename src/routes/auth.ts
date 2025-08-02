import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { email, password } = req.body;

    // Check admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@adsiri.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Adsiri@2024';

    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, await bcrypt.hash(adminPassword, 12));

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const userData = {
      id: 'admin-001',
      email: adminEmail,
      role: 'admin'
    };

    const token = generateToken(userData);

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
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get current admin user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user!.id,
          email: req.user!.email,
          role: req.user!.role
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Change admin password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', [
  protect,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { currentPassword, newPassword } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'Adsiri@2024';

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, await bcrypt.hash(adminPassword, 12));
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // In a real application, you would update the password in the database
    // For this simple version, we'll just return success
    res.json({
      success: true,
      message: 'Password updated successfully. Please update your environment variables.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router; 