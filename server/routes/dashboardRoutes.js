import express from 'express';
import { getSavingsSummary } from '../controllers/dashboardController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/savings-summary', authMiddleware, getSavingsSummary);

export default router;
