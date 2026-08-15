const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['superadmin', 'editor'], default: 'editor' }
  },
  { timestamps: true }
);

AdminSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

AdminSchema.methods.toSafeObject = function toSafeObject() {
  return { id: this._id, name: this.name, email: this.email, role: this.role };
};

module.exports = mongoose.model('Admin', AdminSchema);
