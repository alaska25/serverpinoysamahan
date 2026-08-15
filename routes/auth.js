const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: admin._id, role: admin.role, name: admin.name },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({ token, admin: admin.toSafeObject() });
    } catch (err) {
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// GET /api/auth/me — verify token & return current admin
router.get('/me', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin.toSafeObject());
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
