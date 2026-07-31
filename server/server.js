import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import recurringExpenseRoutes from './routes/recurringExpenseRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ message: 'Student Expense Tracker API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/recurring-expenses', recurringExpenseRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other server or use a different PORT.`);
  } else {
    console.error('Server startup error:', error.message);
  }
});
