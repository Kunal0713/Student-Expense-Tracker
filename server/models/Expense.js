import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Food', 'Travel', 'Shopping', 'Education', 'Other'] },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isRecurring: { type: Boolean, default: false },
  recurringExpense: { type: mongoose.Schema.Types.ObjectId, ref: 'RecurringExpense', default: null }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
