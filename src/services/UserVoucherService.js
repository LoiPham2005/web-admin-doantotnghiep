import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const userVoucherService = {
  saveVoucherToUser: async ({ user_id, voucher_id }) => {
    try {
      console.log('Sending data:', { user_id, voucher_id });

      const response = await axios.post(
        // Sửa lại URL endpoint
        `${API_URL}/user-vouchers/save`,
        {
          user_id,
          voucher_id
        },
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving voucher to user:", error);
      throw error;
    }
  },

  getUsersByVoucherId: async (voucherId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `${API_URL}/user-vouchers/voucher/${voucherId}`,
        {
          // headers: {
          //   'Authorization': `Bearer ${token}`
          // }
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting voucher users:", error);
      throw error.response?.data || error;
    }
  },

  removeAllUserVouchers: async (voucherId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(
        `${API_URL}/user-vouchers/voucher/${voucherId}`,
        {
          // headers: {
          //   'Authorization': `Bearer ${token}`
          // }
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing user vouchers:", error);
      throw error;
    }
  }
};