import express from 'express';
import { getVisitors, logVisitor } from '../controllers/visitorController.js';

const router = express.Router();

router.post('/', logVisitor);
router.get('/', getVisitors);

export default router;
