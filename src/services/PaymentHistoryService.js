import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

const PaymentHistoryService = {
    getAllPayments: async (page = 1, limit = 15) => {
        try {
            const response = await axios.get(`${API_URL}/payment-history/list`, {
                params: {
                    page,
                    limit
                },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error in getAllPayments:', error);
            throw error;
        }
    },

    getPaymentById: async (id) => {
        const response = await axios.get(`${API_URL}/payment-history/${id}`,
            {
                headers: getAuthHeader()
            }
        );
        return response.data;
    },

    getPaymentStatistics: async (startDate, endDate) => {
        const response = await axios.get(`${API_URL}/payment-history/statistics`, {
            params: { start_date: startDate, end_date: endDate },
            headers: getAuthHeader()
        });
        return response.data;
    },

    searchPayments: async (keyword) => {
        try {
            const response = await axios.get(`${API_URL}/payment-history/search`, {
                params: { keyword },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error("Error searching payments:", error);
            throw error;
        }
    }
};

export default PaymentHistoryService;