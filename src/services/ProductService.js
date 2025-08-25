// src/services/ProductService.js
import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/shoes/list-web`, {
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
      console.error("Error fetching products:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching products'
      };
    }
  },

  // Thêm sản phẩm mới
  addProduct: async (productData) => {
    try {
      // Log để debug
      console.log('Product data being sent:', {
        name: productData.get('name'),
        description: productData.get('description'),
        brand_id: productData.get('brand_id'),
        category_id: productData.get('category_id'),
        status: productData.get('status')
      });

      const response = await axios.post(`${API_URL}/shoes/add`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });

      // Log response để debug
      console.log('Response from server:', response.data);

      return response.data;
    } catch (error) {
      console.error("Error details:", error.response?.data);
      throw error.response?.data || error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      // Log data trước khi gửi
      console.log('Updating product with data:', {
        id,
        name: productData.get('name'),
        description: productData.get('description'),
        brand_id: productData.get('brand_id'),
        category_id: productData.get('category_id'),
        status: productData.get('status'),
        mediaFiles: productData.getAll('media')
      });

      const response = await axios.put(`${API_URL}/shoes/edit/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });

      // Log response
      console.log('Update response:', response.data);

      return response.data;
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/shoes/delete/${id}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error.response?.data || error;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (keyword) => {
    try {
      const response = await axios.get(`${API_URL}/shoes/search`, {
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
      console.error("Error searching products:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error searching products'
      };
    }
  },

  // Lấy thông tin sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/shoes/${id}`, {
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
      console.error("Error fetching product:", error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error fetching product'
      };
    }
  },

  // Thêm method getProductReviews
  getProductReviews: async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/reviews/product/${productId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      throw error;
    }
  }
};