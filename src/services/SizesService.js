import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const sizesService = {
  // Lấy danh sách size
  getSizes: async () => {
    try {
      const response = await axios.get(`${API_URL}/sizes/list`,
        {
          headers: getAuthHeader()
        }
      );
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
      console.error("Error fetching sizes:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching sizes'
      };
    }
  },

  // Thêm size mới
  addSize: async (sizeData) => {
    try {
      const response = await axios.post(`${API_URL}/sizes/add`, sizeData,{
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error adding size:", error);
      throw error.response?.data || error;
    }
  },

  // Cập nhật size
  updateSize: async (id, sizeData) => {
    try {
      const response = await axios.put(`${API_URL}/sizes/edit/${id}`, sizeData,{
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error updating size:", error);
      throw error.response?.data || error;
    }
  },

  // Xóa size
  deleteSize: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/sizes/delete/${id}`,{
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting size:", error);
      throw error.response?.data || error;
    }
  }
};