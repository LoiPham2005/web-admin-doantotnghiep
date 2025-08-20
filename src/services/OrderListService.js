import axiosInstance from './config';
import { getAuthHeader } from '../config/authHeader';

export const orderListService = {
  // Get all orders
  getOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders/list', {
        headers: getAuthHeader()
      });
      console.log('Orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, data) => {
    try {
      const response = await axiosInstance.put(`/orders/status/${orderId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Add search orders function
  searchOrders: async (keyword) => {
    try {
      const response = await axiosInstance.get('/orders/search', {
        params: { keyword },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error searching orders:", error);
      throw error;
    }
  },

  // Refund payment function
  refundMomoPayment: async (refundData) => {
    try {
      const response = await axiosInstance.post('/momo/refund', refundData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error refunding payment:", error);
      throw error;
    }
  },

  // Get order detail by ID
  getOrderDetail: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/orders/getbyid/${orderId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw error;
    }
  },

  // Get return request by order ID
  getReturnRequest: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/return-requests/${orderId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching return request:", error);
      throw error;
    }
  },

  // Update return request status
  updateReturnRequestStatus: async (requestId, data) => {
    try {
      const response = await axiosInstance.put(`/return-requests/status/${requestId}`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error updating return request status:", error);
      throw error;
    }
  },

  // Get cancel request by order ID
  getCancelRequest: async (orderId) => {
    try {
      const response = await axiosInstance.get(`/cancel-requests/${orderId}`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cancel request:", error);
      throw error;
    }
  },

  // Update cancel request status
  updateCancelRequestStatus: async (requestId, data) => {
    try {
      const response = await axiosInstance.put(`/cancel-requests/status/${requestId}`, data, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error("Error updating cancel request status:", error);
      throw error;
    }
  }
};