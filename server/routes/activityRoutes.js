import express from 'express';
import { getRecentActivity } from '../controllers/activityController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getRecentActivity);

export default router;
