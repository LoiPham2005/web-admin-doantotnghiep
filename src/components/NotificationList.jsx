import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/vi';
import './NotificationList.css';

const NotificationList = ({ notifications, onClose, onMarkAsRead, onMarkAllAsRead }) => {
    const { t } = useTranslation();

    return (
        <div className="notification-dropdown">
            <div className="notification-header">
                <h3>{t('notifications.title')}</h3>
                <div className="header-actions">
                    <button 
                        className="mark-all-btn" 
                        onClick={onMarkAllAsRead}
                        title={t('notifications.markAllAsRead')}
                    >
                        <i className="fas fa-check-double"></i>
                    </button>
                    <button 
                        className="close-btn" 
                        onClick={onClose}
                        title={t('notifications.close')}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div className="notification-list">
                {notifications.length === 0 ? (
                    <div className="no-notifications">{t('notifications.noNotifications')}</div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                            onClick={() => onMarkAsRead(notification._id)}
                        >
                            <div className="notification-icon">
                                <i className={`fas ${getNotificationIcon(notification.notification_id.type)}`}></i>
                            </div>
                            <div className="notification-content">
                                <div className="notification-title">{notification.notification_id.title}</div>
                                <div className="notification-message">{notification.notification_id.content}</div>
                                <div className="notification-time">
                                    {moment(notification.notification_id.createdAt).locale('vi').fromNow()}
                                </div>
                            </div>
                            {!notification.is_read && <div className="unread-dot"></div>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const getNotificationIcon = (type) => {
    switch (type) {
        case 'order': return 'fa-shopping-bag';
        case 'system': return 'fa-bell';
        case 'promotion': return 'fa-tag';
        default: return 'fa-bell';
    }
};

export default NotificationList;