import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const shoesVariantService = {
  // Lấy danh sách variants của một sản phẩm
  getVariantsByShoeId: async (shoeId) => {
    try {
      const response = await axios.get(`${API_URL}/variants/shoe/${shoeId}`, {
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
      console.error("Error fetching variants:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching variants'
      };
    }
  },

  // Thêm variant mới
  addVariant: async (variantData) => {
    try {
      // Đảm bảo status được gửi đi
      const response = await axios.post(`${API_URL}/variants/add`, {
        ...variantData,
        status: variantData.status || 'available'
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error adding variant:", error);
      throw error.response?.data || error;
    }
  },

  // Lấy chi tiết variant
  getVariantById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/variants/${id}`,
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
      console.error("Error fetching variant:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching variant'
      };
    }
  },

  // Cập nhật variant
  updateVariant: async (id, variantData) => {
    try {
      const response = await axios.put(`${API_URL}/variants/edit/${id}`, {
        ...variantData,
        status: variantData.status // Đảm bảo status được gửi đi
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error updating variant:", error);
      throw error.response?.data || error;
    }
  },

  // Xóa variant
  deleteVariant: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/variants/delete/${id}`,
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting variant:", error);
      throw error.response?.data || error;
    }
  }
};