import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const userService = {
    // Lấy danh sách tất cả users
    getAllUsers: async () => {
        try {
            const response = await axios.get(`${API_URL}/users/list`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    // Lấy thông tin user theo ID
    getUserById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/users/getbyid/${id}`, {
                headers: getAuthHeader()
            });
            return response;
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật thông tin user
    updateUser: async (id, userData) => {
        try {
            if (!id) {
                throw new Error('User ID is required');
            }

            const response = await axios.patch(
                `${API_URL}/users/edit/${id}`,
                userData,
                {
                    headers: {
                        ...getAuthHeader(),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            return response;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    // Thêm method search users
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
    }
};