import { getAuthHeader } from '../config/authHeader';
import { API_URL } from './config';

export const accountService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users/list`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      return {
        success: true,
        data: data.filter(user => user.role === 'user') // Only get users, not admins
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: error.message
      };
    }
  }
};