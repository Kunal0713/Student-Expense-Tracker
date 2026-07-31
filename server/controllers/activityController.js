import ActivityLog from '../models/ActivityLog.js';

export const getRecentActivity = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 20);
    const safeLimit = Number.isNaN(limit) ? 20 : Math.min(Math.max(limit, 1), 100);

    const activity = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(safeLimit);

    return res.status(200).json(activity);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
