import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from '../config/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check token expiration và refresh nếu cần
  const checkAndRefreshToken = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return false;

      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post('/refresh-token', { refreshToken });
        
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return true;
      }
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isValid = await checkAndRefreshToken();
        if (isValid) {
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Check token mỗi phút
    const interval = setInterval(checkAndRefreshToken, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = (userData) => {
    if (userData.role === 'admin') {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('accessToken', userData.accessToken);
      localStorage.setItem('userId', userData.id);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserContext = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      user, 
      login, 
      logout,
      updateUserContext 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);