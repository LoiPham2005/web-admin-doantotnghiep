import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const brandService = {
    // Lấy danh sách thương hiệu
    getBrands: async () => {
        try {
            const response = await axios.get(`${API_URL}/brand/list`, {
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
            console.error("Error fetching brands:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error fetching brands'
            };
        }
    },

    // Thêm thương hiệu
    addBrand: async (brandData) => {
        try {
            const response = await axios.post(`${API_URL}/brand/add`, brandData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeader()
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error adding brand:", error);
            throw error.response?.data || error;
        }
    },

    // Cập nhật thương hiệu
    updateBrand: async (id, brandData) => {
        try {
            console.log('Updating brand with data:', {
                id,
                name: brandData.get('name'),
                media: brandData.get('media')
            });

            const response = await axios.put(`${API_URL}/brand/edit/${id}`, brandData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...getAuthHeader()
                }
            });

            console.log('Update response:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error updating brand:", error.response?.data || error);
            throw error.response?.data || error;
        }
    },

    // Xóa thương hiệu
    deleteBrand: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/brand/delete/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting brand:", error);
            throw error.response?.data || error;
        }
    }
};