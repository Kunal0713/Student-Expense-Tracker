import express from 'express';
import {
  createRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpenses,
  processDueRecurringExpenses,
  updateRecurringExpense
} from '../controllers/recurringExpenseController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getRecurringExpenses);
router.post('/', authMiddleware, createRecurringExpense);
router.post('/process-due', authMiddleware, processDueRecurringExpenses);
router.put('/:id', authMiddleware, updateRecurringExpense);
router.delete('/:id', authMiddleware, deleteRecurringExpense);

export default router;
