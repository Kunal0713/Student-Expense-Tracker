import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  source: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  notes: { type: String, trim: true, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Income = mongoose.model('Income', incomeSchema);
export default Income;
