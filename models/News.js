const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', NewsSchema);
