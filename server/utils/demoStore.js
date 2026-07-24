import bcrypt from 'bcryptjs';

// In-memory store for demo mode
const demoUsers = new Map(); // key: email
const demoUsersById = new Map(); // key: userId

export const getDemoUser = async (email) => {
  return demoUsers.get(email);
};

export const getDemoUserById = async (userId) => {
  return demoUsersById.get(userId);
};

export const createDemoUser = async (name, email, hashedPassword) => {
  const userId = Math.random().toString(36).substr(2, 9);
  const user = { _id: userId, name, email, password: hashedPassword, createdAt: new Date() };
  demoUsers.set(email, user);
  demoUsersById.set(userId, user);
  return user;
};

export const isDemoMode = () => {
  return demoUsers.size >= 0; // Always true, we're using demo for now
};
