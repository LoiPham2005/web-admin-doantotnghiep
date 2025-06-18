import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthService from '../../services/AuthService';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_URL } from '../../services/config';  // Add this import
import { useTranslation } from 'react-i18next';
import './LoginScreen.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberPassword: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      console.log('API URL:', API_URL); // Thêm log để kiểm tra URL
      console.log('Attempting login with:', {
        email: formData.email,
        password: formData.password
      });

      const response = await AuthService.login(formData.email, formData.password);
      console.log('Login response:', response);

      if (response.success) {
        // Kiểm tra role admin
        if (response.data.user.role !== 'admin') {
          setError('Chỉ tài khoản Admin mới có thể đăng nhập');
          return;
        }

        const userInfo = {
          id: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          avatar: response.data.user.avatar,
          role: response.data.user.role,
          accessToken: response.data.accessToken
        };

        // Lưu thông tin vào localStorage trước
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('userId', response.data.user._id);

        console.log('Setting user info:', userInfo);

        // Gọi hàm login từ context 
        await login(userInfo);

        // Sau đó chuyển hướng
        console.log('Before navigate - userInfo:', localStorage.getItem('userInfo'));
        console.log('Before navigate - accessToken:', localStorage.getItem('accessToken'));
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra khi đăng nhập. Vui lòng kiểm tra kết nối mạng và thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>{t('login.title')}</h1>
        <p>{t('login.subtitle')}</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">{t('login.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('login.password')}</label>
            <a href="#" className="forgot-password">{t('login.forgotPassword')}</a>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="rememberPassword"
              name="rememberPassword"
              checked={formData.rememberPassword}
              onChange={handleChange}
            />
            <label htmlFor="rememberPassword">{t('login.rememberMe')}</label>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? t('login.signingIn') : t('login.signIn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
