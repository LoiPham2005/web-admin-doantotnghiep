import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const accountService = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/list`, {
        headers: getAuthHeader()
      });
      if (response.data) {
        return {
          success: true,
          data: response.data.filter(user => user.role === 'user')
        };
      }
      return {
        success: false,
        message: 'Error fetching users'
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  // Add search users method
  searchUsers: async (keyword) => {
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { keyword },
        headers: getAuthHeader()
      });
      if (response.data.status === 200) {
        return {
          success: true,
          data: response.data.data
        };
      }
      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      console.error("Error searching users:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error searching users'
      };
    }
  },

  toggleUserActive: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/users/toggle-active/${id}`, {}, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error toggling user:", error);
      throw error.response?.data || error;
    }
  }
};