import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDemoUser, createDemoUser } from '../utils/demoStore.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check demo store first
    let existingUser = await getDemoUser(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Try database
    try {
      existingUser = await User.findOne({ email }).maxTimeMS(2000);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
    } catch (dbError) {
      console.log('Using demo mode for registration');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to save to database
    let user;
    try {
      user = await User.create({ name, email, password: hashedPassword });
    } catch (dbError) {
      // Fallback to demo store
      user = await createDemoUser(name, email, hashedPassword);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check demo store first
    let user = await getDemoUser(email);

    // If not in demo store, try database
    if (!user) {
      try {
        user = await User.findOne({ email }).maxTimeMS(2000);
      } catch (dbError) {
        console.log('Using demo mode for login');
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
