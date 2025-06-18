import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const notificationUserService = {
  // Tạo thông báo cho user
  createUserNotification: async ({ notification_id, user_id }) => {
    try {
      console.log('Creating notification user with:', { notification_id, user_id });
      const response = await axios.post(`${API_URL}/notifications/user/add`, {
        notification_id,
        user_id,
        headers: getAuthHeader()
      },
        // { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating user notification:', error);
      // Nếu lỗi duplicate key, coi như thành công
      if (error.response?.status === 400 &&
        error.response?.data?.message?.includes('đã có thông báo')) {
        return null;
      }
      throw error;
    }
  },

  // Lấy thông báo của user
  getUserNotifications: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/notifications/user/${userId}`,
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  // Cập nhật thông báo
  updateUserNotification: async (userId, notificationId, data) => {
    try {
      const response = await axios.put(
        `${API_URL}/notifications/user/${userId}/${notificationId}`,
        data, {
        headers: getAuthHeader()
      }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating user notification:', error);
      throw error;
    }
  },

  // Xóa thông báo của user
  deleteUserNotification: async (userId, notificationId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/notifications/user/${userId}/${notificationId}`,
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting user notification:', error);
      throw error;
    }
  },

  // Lấy danh sách users của một notification
  getUsersByNotificationId: async (notificationId) => {
    try {
      const response = await axios.get(`${API_URL}/notifications/${notificationId}/users`, {
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error fetching notification users:', error);
      throw error;
    }
  }
};