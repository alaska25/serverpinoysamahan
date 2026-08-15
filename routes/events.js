const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/events — public, supports ?upcoming=true
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.upcoming === 'true') {
      filter.date = { $gte: new Date() };
    }
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Could not load events' });
  }
});

// GET /api/events/:id — public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Could not load event' });
  }
});

const validateEvent = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
  body('location').notEmpty().withMessage('Location is required')
];

// POST /api/events — admin only
router.post('/', auth, validateEvent, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const event = await Event.create({ ...req.body, createdBy: req.admin.id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Could not create event' });
  }
});

// PUT /api/events/:id — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Could not update event' });
  }
});

// DELETE /api/events/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete event' });
  }
});

module.exports = router;
