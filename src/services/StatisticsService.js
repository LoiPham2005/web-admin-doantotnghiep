import axios from 'axios';
// import axios from '../config/axiosConfig';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const statisticsService = {
    getDashboardStats: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_URL}/statistics/daily`, {
                params: {
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString()
                },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    getRevenueByDateRange: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_URL}/statistics/revenue`, {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching revenue data:', error);
            throw error;
        }
    },

    getTopProducts: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_URL}/statistics/top-products`, {
                params: {
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString()
                },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top products:', error);
            throw error;
        }
    },

    getTopCustomers: async (startDate, endDate) => {
        try {
            const response = await axios.get(`${API_URL}/statistics/top-customers`, {
                params: {
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString()
                },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching top customers:', error);
            throw error;
        }
    }
};
