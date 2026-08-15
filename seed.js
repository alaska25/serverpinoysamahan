require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

(async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || 'admin@pinoysajapan.org').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'changeme123';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists for ${email}. No changes made.`);
    process.exit(0);
  }

  await Admin.create({
    name: 'Samahan Admin',
    email,
    password,
    role: 'superadmin'
  });

  console.log(`Admin account created:\n  email: ${email}\n  password: ${password}\nPlease log in and change the password.`);
  process.exit(0);
})().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
