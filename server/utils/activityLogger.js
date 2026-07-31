import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async ({ userId, actionType, message, metadata = {} }) => {
  if (!userId || !actionType || !message) {
    return;
  }

  try {
    await ActivityLog.create({
      user: userId,
      actionType,
      message,
      metadata
    });
  } catch (error) {
    console.error('Activity logging failed:', error.message);
  }
};
