const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    hometown: { type: String, trim: true, default: '' },
    prefecture: { type: String, trim: true, default: '' },
    occupation: { type: String, trim: true, default: '' },
    photoUrl: { type: String, default: '' },
    memberSince: { type: Date, default: Date.now },
    showInDirectory: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', MemberSchema);
