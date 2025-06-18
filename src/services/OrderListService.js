import axiosInstance from './config';
import { getAuthHeader } from '../config/authHeader';

export const orderListService = {
  // Get all orders
  getOrders: async () => {
    try {
      const response = await axiosInstance.get('/orders/list', {
        headers: getAuthHeader()
      });
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
  }
};