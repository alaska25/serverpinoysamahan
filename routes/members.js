const express = require('express');
const { body, validationResult } = require('express-validator');
const Member = require('../models/Member');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/members — public directory (only those opted in), admin sees all with ?all=true
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { showInDirectory: true };
    const members = await Member.find(filter).sort({ fullName: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Could not load member directory' });
  }
});

router.post(
  '/',
  auth,
  [body('fullName').notEmpty().withMessage('Full name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    try {
      const member = await Member.create(req.body);
      res.status(201).json(member);
    } catch (err) {
      res.status(500).json({ message: 'Could not add member' });
    }
  }
);

router.put('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Could not update member' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member removed' });
  } catch (err) {
    res.status(500).json({ message: 'Could not remove member' });
  }
});

module.exports = router;
