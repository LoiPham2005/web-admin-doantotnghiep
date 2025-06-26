import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const notificationService = {
    getAllNotifications: async () => {
        try {
            const response = await axios.get(`${API_URL}/notifications/list`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    createNotification: async (notificationData) => {
        try {
            const response = await axios.post(`${API_URL}/notifications/add`, notificationData,
                {
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    },

    updateNotification: async (id, notificationData) => {
        try {
            const response = await axios.put(
                `${API_URL}/notifications/update/${id}`,
                notificationData,
                {
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating notification:', error);
            throw error;
        }
    },

    // Xóa thông báo
    deleteNotification: async (id) => {
        try {
            console.log('Deleting notification:', id);
            const response = await axios.delete(`${API_URL}/notifications/delete/${id}`,
                {
                    headers: getAuthHeader()
                }
            );
            return response;
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw error;
        }
    },

    // Thêm hàm search notifications
    searchNotifications: async (keyword) => {
        try {
            const response = await axios.get(`${API_URL}/notifications/search`, {
                params: { keyword },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error searching notifications:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error searching notifications'
            };
        }
    }
};