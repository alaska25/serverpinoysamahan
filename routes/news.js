const express = require('express');
const { body, validationResult } = require('express-validator');
const News = require('../models/News');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/news — public, only published unless admin
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { published: true };
    const news = await News.find(filter).sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: 'Could not load news' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Article not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Could not load article' });
  }
});

const validateNews = [
  body('title').notEmpty().withMessage('Title is required'),
  body('summary').notEmpty().withMessage('Summary is required'),
  body('body').notEmpty().withMessage('Body is required')
];

router.post('/', auth, validateNews, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  try {
    const article = await News.create({ ...req.body, createdBy: req.admin.id });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: 'Could not create article' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Could not update article' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete article' });
  }
});

module.exports = router;
