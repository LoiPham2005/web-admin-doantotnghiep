import React, { useState, useEffect } from "react"; // Thêm useEffect
import { FaBars, FaBell, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import NotificationList from './NotificationList';
import { notificationUserService } from '../services/NotificationUserService';
import './Header.css';

const Header = ({ onToggleSidebar }) => {
  const { user } = useAuth(); // Sử dụng user từ AuthContext
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'vi');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
        const response = await notificationUserService.getAdminNotifications();
        if (response.status === 200) {
            setNotifications(response.data.notifications);
            setUnreadCount(
                response.data.notifications.filter(n => !n.is_read).length
            );
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

  const handleMarkAsRead = async (notificationId) => {
    try {
        await notificationUserService.markAsRead(notificationId);
        setNotifications(notifications.map(notification => 
            notification._id === notificationId 
                ? { ...notification, is_read: true }
                : notification
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
};

const handleMarkAllAsRead = async () => {
    try {
        const response = await notificationUserService.markAllAsRead();
        if (response.status === 200) {
            // Cập nhật state
            setNotifications(notifications.map(notification => ({
                ...notification,
                is_read: true
            })));
            setUnreadCount(0);
            
            // Không đóng cửa sổ notification
            // setShowNotifications(false); // Bỏ dòng này
        }
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
    }
};

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    setIsLanguageOpen(false);
    localStorage.setItem('i18nextLng', lang);
  };

  return (
    <header className="header">
      {/* Left Side - Menu Icon & Search */}
      <div className="header-left">
        <FaBars className="menu-icon" onClick={onToggleSidebar} />
        {/* <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder={t('common.search')} className="search-input" />
        </div> */}
      </div>

      {/* Right Side */}
      <div className="header-right">
        {/* Notification Icon */}
        <div className="notification-container">
          <div
            className="notification"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell className="bell-icon" />
            {unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </div>

          {showNotifications && (
            <NotificationList
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}
        </div>

        {/* Theme Toggle */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? (
            <FaMoon className="theme-icon moon" />
          ) : (
            <FaSun className="theme-icon sun" />
          )}
        </div>

        {/* Language Selector */}
        <div className="language-selector">
          <div
            className="language-selected"
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          >
            <img
              src={currentLanguage === 'vi'
                ? "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                : "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"
              }
              alt="Language Flag"
              className="flag"
            />
            <span>{currentLanguage === 'vi' ? 'Tiếng Việt' : 'English'}</span>
            <IoMdArrowDropdown className="dropdown-icon" />
          </div>

          {isLanguageOpen && (
            <div className="language-dropdown">
              <div
                className={`language-option ${currentLanguage === 'vi' ? 'active' : ''}`}
                onClick={() => handleChangeLanguage('vi')}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                  alt="Vietnam Flag"
                  className="flag"
                />
                <span>Tiếng Việt</span>
              </div>
              <div
                className={`language-option ${currentLanguage === 'en' ? 'active' : ''}`}
                onClick={() => handleChangeLanguage('en')}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg"
                  alt="UK Flag"
                  className="flag"
                />
                <span>English</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="profile">
          <img
            src={user?.avatar || "https://randomuser.me/api/portraits/women/65.jpg"}
            alt="Profile"
            className="profile-pic"
            onError={(e) => {
              e.target.src = "https://randomuser.me/api/portraits/women/65.jpg";
            }}
          />
          <div className="profile-info">
            <p className="profile-name">{user?.username || 'Admin'}</p>
            <p className="profile-role">{user?.role || 'Admin'}</p>
          </div>
          {/* <IoMdArrowDropdown className="dropdown-icon" /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
