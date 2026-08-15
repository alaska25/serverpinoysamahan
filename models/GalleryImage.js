const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, trim: true, default: '' },
    album: { type: String, trim: true, default: 'General' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);
