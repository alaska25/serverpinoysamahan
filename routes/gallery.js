const express = require('express');
const { body, validationResult } = require('express-validator');
const GalleryImage = require('../models/GalleryImage');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/gallery — public, optional ?album=
router.get('/', async (req, res) => {
  try {
    const filter = req.query.album ? { album: req.query.album } : {};
    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Could not load gallery' });
  }
});

router.post(
  '/',
  auth,
  [body('imageUrl').notEmpty().withMessage('Image URL is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

    try {
      const image = await GalleryImage.create({ ...req.body, uploadedBy: req.admin.id });
      res.status(201).json(image);
    } catch (err) {
      res.status(500).json({ message: 'Could not add image' });
    }
  }
);

router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete image' });
  }
});

module.exports = router;
