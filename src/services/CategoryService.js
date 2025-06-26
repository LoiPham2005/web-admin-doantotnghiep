// src/services/ProductService.js
import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const categoryService = {
  // Lấy danh sách danh mục
  getCategories: async (isAdmin = false) => {
    try {
      const response = await axios.get(`${API_URL}/category/list`, {
        params: { isAdmin },
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
      console.error("Error fetching categories:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching categories'
      };
    }
  },

  // Thêm danh mục
  addCategory: async (categoryData) => {
    try {
      const response = await axios.post(`${API_URL}/category/add`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error.response?.data || error;
    }
  },

  // Cập nhật danh mục
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axios.put(`${API_URL}/category/edit/${id}`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error.response?.data || error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/category/delete/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error.response?.data || error;
    }
  },

  // Thêm hàm toggle active
  toggleCategoryActive: async (id) => {
    try {
      const response = await axios.put(`${API_URL}/category/toggle-active/${id}`, {}, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error toggling category:", error);
      throw error.response?.data || error;
    }
  },

  // Thêm hàm search categories
  searchCategories: async (keyword) => {
    try {
      const response = await axios.get(`${API_URL}/category/search`, {
        params: { key: keyword },
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
      console.error("Error searching categories:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error searching categories'
      };
    }
  }
};