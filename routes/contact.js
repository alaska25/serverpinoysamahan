const express = require('express');
const { body, validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');

const router = express.Router();

const validateMessage = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('message').notEmpty().withMessage('Message is required')
];

// POST /api/contact — public, used by both Contact and Join forms (type: 'contact' | 'join')
router.post('/', validateMessage, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const entry = await ContactMessage.create(req.body);
    res.status(201).json({ message: 'Thank you! We received your message.', id: entry._id });
  } catch (err) {
    res.status(500).json({ message: 'Could not send message, please try again' });
  }
});

// GET /api/contact — admin only, view submissions
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.query.type ? { type: req.query.type } : {};
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Could not load messages' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Message not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Could not update message' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete message' });
  }
});

module.exports = router;
