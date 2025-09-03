import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const shippingService = {
  // Lấy danh sách phí vận chuyển
  getRates: async () => {
    try {
      const response = await axios.get(`${API_URL}/shipping/list`, {
        headers: getAuthHeader()
      });
      return {
        success: true,
        data: response.data?.data || [] // Ensure we return an array
      };
    } catch (error) {
      console.error("Error fetching shipping rates:", error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Error fetching shipping rates'
      };
    }
  },

  // Thêm phí vận chuyển
  addRate: async (rateData) => {
    try {
      const response = await axios.post(`${API_URL}/shipping/add`, rateData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cập nhật phí vận chuyển
  updateRate: async (id, rateData) => {
    try {
      const response = await axios.put(`${API_URL}/shipping/edit/${id}`, rateData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xóa phí vận chuyển
  deleteRate: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/shipping/delete/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bật / Tắt trạng thái isActive
  toggleActive: async (id, isActive) => {
    try {
      const response = await axios.put(`${API_URL}/shipping/edit/${id}`,
        { isActive },
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};
