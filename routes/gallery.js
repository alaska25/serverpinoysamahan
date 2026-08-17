const express = require('express');
const { body, validationResult } = require('express-validator');
const GalleryImage = require('../models/GalleryImage');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

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

// POST /api/gallery — accepts an uploaded file (field name "image")
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const image = await GalleryImage.create({
      imageUrl,
      caption: req.body.caption || '',
      album: req.body.album || 'General',
      uploadedBy: req.admin.id
    });

    res.status(201).json(image);
  } catch (err) {
    console.error('Gallery upload error:', err);
    res.status(500).json({ message: 'Could not add image' });
  }
});

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