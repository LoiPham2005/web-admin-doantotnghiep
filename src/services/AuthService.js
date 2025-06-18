import axiosInstance from '../config/axiosConfig';
import { API_URL } from './config';

const AuthService = {
  login: async (email, password) => {
    try {
      console.log('Making login request to:', `${API_URL}/users/login`);

      const response = await axiosInstance.post('/users/login', {
        email,
        password
      });

      console.log('Login API response:', response.data);

      if (response.data.status === 200) { // Thêm kiểm tra status
        // Lưu token và thông tin user vào localStorage
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));

        return {
          success: true,
          data: response.data
        };
      }

      return {
        success: false,
        message: response.data.message || 'Đăng nhập thất bại'
      };
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users/reg`, userData);

      if (response.data.user) {
        return {
          success: true,
          data: response.data
        };
      }
      return {
        success: false,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export default AuthService;