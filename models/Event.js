const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['fiesta', 'religious', 'sports', 'meeting', 'cultural', 'livelihood', 'other'],
      default: 'other'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

EventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', EventSchema);
