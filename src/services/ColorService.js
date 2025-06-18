import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const colorService = {
  // Lấy danh sách màu
  getColors: async () => {
    try {
      const response = await axios.get(`${API_URL}/colors/list`, {
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
      console.error("Error fetching colors:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching colors'
      };
    }
  },

  // Thêm màu mới
  addColor: async (colorData) => {
    try {
      const response = await axios.post(`${API_URL}/colors/add`, colorData, {
        headers: getAuthHeader()
      }); 
      if (response.data.status === 200) {
        return response.data;
      }
      throw new Error(response.data.message || 'Thêm màu thất bại');
    } catch (error) {
      console.error("Error adding color:", error);
      throw error.response?.data || error;
    }
  },

  // Cập nhật màu
  updateColor: async (id, colorData) => {
    try {
      const response = await axios.put(`${API_URL}/colors/edit/${id}`, colorData, {
        headers: getAuthHeader()
      }); 
      return response.data;
    } catch (error) {
      console.error("Error updating color:", error);
      throw error.response?.data || error;
    }
  },

  // Xóa màu
  deleteColor: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/colors/delete/${id}`, {
        headers: getAuthHeader()
      }); 
      return response.data;
    } catch (error) {
      console.error("Error deleting color:", error);
      throw error.response?.data || error;
    }
  }
};

