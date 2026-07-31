import express from 'express';
import { createIncome, deleteIncome, getIncomes, updateIncome } from '../controllers/incomeController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getIncomes);
router.post('/', authMiddleware, createIncome);
router.put('/:id', authMiddleware, updateIncome);
router.delete('/:id', authMiddleware, deleteIncome);

export default router;
