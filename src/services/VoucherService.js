import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const voucherService = {
    // Get all vouchers
    getVouchers: async () => {
        try {
            const response = await axios.get(`${API_URL}/vouchers/list`);
            console.log('Vouchers response:', response); // Thêm log
            return response.data;
        } catch (error) {
            console.error("Error fetching vouchers:", error);
            throw error.response?.data || error;
        }
    },

    // Add new voucher
    addVoucher: async (voucherData) => {
        try {
            const response = await axios.post(
                `${API_URL}/vouchers/add`,
                voucherData,
                {
                    headers: getAuthHeader()
                }
            );
            return response;
        } catch (error) {
            console.error("Error adding voucher:", error);
            throw error;
        }
    },

    // Update voucher
    updateVoucher: async (id, voucherData) => {
        try {
            const response = await axios.put(
                `${API_URL}/vouchers/edit/${id}`,
                voucherData,
                {
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // }
                    headers: getAuthHeader()
                }
            );
            return response;
        } catch (error) {
            console.error("Error updating voucher:", error);
            throw error;
        }
    },

    // Delete voucher
    deleteVoucher: async (id) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete(
                `${API_URL}/vouchers/delete/${id}`,
                {
                    // headers: {
                    //     'Authorization': `Bearer ${token}`
                    // }
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting voucher:", error);
            throw error.response?.data || error;
        }
    },

    // Thêm hàm search vouchers
    searchVouchers: async (keyword) => {
        try {
            const response = await axios.get(`${API_URL}/vouchers/search`, {
                params: { keyword },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error searching vouchers:", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error searching vouchers'
            };
        }
    }
};