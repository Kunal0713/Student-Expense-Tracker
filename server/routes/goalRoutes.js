import express from 'express';
import { createGoal, deleteGoal, getGoals, updateGoal } from '../controllers/goalController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getGoals);
router.post('/', authMiddleware, createGoal);
router.put('/:id', authMiddleware, updateGoal);
router.delete('/:id', authMiddleware, deleteGoal);

export default router;
