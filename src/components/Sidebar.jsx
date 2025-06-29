// components/Sidebar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';
import {
  FaTachometerAlt,
  FaBoxes,
  FaTags,
  FaTag,
  FaTicketAlt,
  FaBell,
  FaUser,
  FaCommentDots,
  FaPen,
  FaListUl,
  FaWarehouse,
  FaMoneyBillWave,
  FaCog,
  FaPowerOff,
  FaImage
} from 'react-icons/fa';

import logoApp from '../assets/logo_icon.png';

function Sidebar({ isCollapsed }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();

    if (window.confirm(t('common.confirmLogout'))) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userId');

      logout();

      navigate('/login');
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{ backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5' }}>
      {/* Logo */}
      <div className="logo-container">
        {!isCollapsed && (
          <h1 className="logo">
            <span className="logo-text-primary">Sneak</span>
            
            <span className="logo-text-secondary">Up</span>
          </h1>
          // <img src={logoApp} alt="Logo" className="logo-image" style={{ width: '70px', height: 'auto', marginLeft: '10px' }} />

        )}
      </div>

      <nav className="sidebar-nav">
        <ul className="main-nav">
          <li>
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              <FaTachometerAlt className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.dashboard')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`}>
              <FaBoxes className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.products')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/category" className={`nav-link ${location.pathname === '/category' ? 'active' : ''}`}>
              <FaTags className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.category')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/brand" className={`nav-link ${location.pathname === '/brand' ? 'active' : ''}`}>
              <FaTag className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.brand')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/banner" className={`nav-link ${location.pathname === '/banner' ? 'active' : ''}`}>
              <FaImage className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.banner')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/voucher" className={`nav-link ${location.pathname === '/voucher' ? 'active' : ''}`}>
              <FaTicketAlt className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.voucher')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/notification" className={`nav-link ${location.pathname === '/notification' ? 'active' : ''}`}>
              <FaBell className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.notification')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/account" className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}>
              <FaUser className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.account')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/chats" className={`nav-link ${location.pathname === '/chats' ? 'active' : ''}`}>
              <FaCommentDots className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.inbox')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/posts" className={`nav-link ${location.pathname === '/posts' ? 'active' : ''}`}>
              <FaPen className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.posts')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/order_list" className={`nav-link ${location.pathname === '/order_list' ? 'active' : ''}`}>
              <FaListUl className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.orderLists')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/product_stock" className={`nav-link ${location.pathname === '/product_stock' ? 'active' : ''}`}>
              <FaWarehouse className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.productStock')}</span>}
            </Link>
          </li>
          <li>
            <Link to="/payment_history" className={`nav-link ${location.pathname === '/payment_history' ? 'active' : ''}`}>
              <FaMoneyBillWave className="nav-icon" />
              {!isCollapsed && <span>{t('common.nav.paymentHistory')}</span>}
            </Link>
          </li>
        </ul>

        <div className="bottom-section">
          <ul className="bottom-nav">
            {/* <li>
              <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
                <FaCog className="nav-icon" />
                {!isCollapsed && <span>{t('common.nav.settings')}</span>}
              </Link>
            </li> */}
            <li>
              <a href="#"
                onClick={handleLogout}
                className="nav-link">
                <FaPowerOff className="nav-icon" />
                {!isCollapsed && <span>{t('common.nav.logout')}</span>}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;