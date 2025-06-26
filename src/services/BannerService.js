import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const bannerService = {
  // Lấy danh sách banner
  getBanners: async () => {
    try {
      const response = await axios.get(`${API_URL}/banner/list`);
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
      console.error("Error fetching banners:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching banners'
      };
    }
  },

  // Thêm banner mới
  addBanner: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/banner/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error adding banner:", error);
      throw error.response?.data || error;
    }
  },

  // Cập nhật banner
  updateBanner: async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/banner/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error.response?.data || error;
    }
  },

  // Xóa banner
  deleteBanner: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/banner/delete/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error.response?.data || error;
    }
  }
};