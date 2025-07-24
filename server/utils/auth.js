// utils/auth.js
export const requireAdmin = (user) => {
  if (!user || user.role !== 'admin') {
    throw new Error('Access denied: Admins only');
  }
};
