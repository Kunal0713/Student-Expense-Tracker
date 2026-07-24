import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDemoUserById } from '../utils/demoStore.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    let user;
    
    // Try to find user in database first
    try {
      user = await User.findById(decoded.id).select('-password').maxTimeMS(2000);
    } catch (dbError) {
      console.log('DB query failed, checking demo store');
    }

    // If not in database, check demo store
    if (!user) {
      user = await getDemoUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
