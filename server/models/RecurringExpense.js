import mongoose from 'mongoose';

const recurringExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: ['Food', 'Travel', 'Shopping', 'Education', 'Other'] },
  nextDueDate: { type: Date, required: true },
  frequency: { type: String, enum: ['monthly'], default: 'monthly' },
  isActive: { type: Boolean, default: true },
  lastProcessedAt: { type: Date, default: null },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const RecurringExpense = mongoose.model('RecurringExpense', recurringExpenseSchema);
export default RecurringExpense;
