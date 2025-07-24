// seedAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './model/user.model.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const admin = new User({
  name: 'Admin',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin',
});

await admin.save();
console.log('✅ Admin user created');
process.exit();
