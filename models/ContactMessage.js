const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['contact', 'join'], default: 'contact' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    prefecture: { type: String, trim: true, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
