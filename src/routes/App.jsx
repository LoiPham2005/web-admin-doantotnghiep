import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner'; // Tạo component này
import LoginScreen from '../screens/Login/LoginScreen';
import DashboardScreen from '../screens/dashboard/Dashboard';
import ProductsScreen from '../screens/products/ProductsScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import VoucherScreen from '../screens/voucher/VoucherScreen';
import NotificationScreen from '../screens/notification/NotificationScreen';
import AccountScreen from '../screens/account/AccountScreen';
import '../config/i18n';
import ProductStockScreen from '../screens/product_stock/ProductStockScreen';
import OrderListScreen from '../screens/order_list/OrderListScreen';
import ChatsScreen from '../screens/chats/ChatsScreen';
import BrandScreen from '../screens/brand/BrandScreen';
import PostsScreen from '../screens/posts/PostsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import PaymentHistoryScreen from '../screens/payment_history/PaymentHistoryScreen';
import BannerScreen from '../screens/banner/BannerScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
    if (!loading && isAuthenticated && user?.role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate, user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated && user?.role === 'admin' ? children : null;
};

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Hiển thị loading khi đang kiểm tra auth
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginScreen />}
      />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <DashboardScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/products"
        element={
          isAuthenticated ? <ProductsScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/category"
        element={
          isAuthenticated ? <CategoryScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/brand"
        element={
          isAuthenticated ? <BrandScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/banner"
        element={
          isAuthenticated ? <BannerScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/voucher"
        element={
          isAuthenticated ? <VoucherScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/notification"
        element={
          isAuthenticated ? <NotificationScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/account"
        element={
          isAuthenticated ? <AccountScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/product_stock"
        element={
          isAuthenticated ? <ProductStockScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/order_list"
        element={
          isAuthenticated ? <OrderListScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/chats"
        element={
          isAuthenticated ? <ChatsScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/posts"
        element={
          isAuthenticated ? <PostsScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/settings"
        element={
          isAuthenticated ? <SettingsScreen /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/payment_history"
        element={
          isAuthenticated ? <PaymentHistoryScreen /> : <Navigate to="/login" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;