import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../../services/NotificationService';
import { notificationUserService } from '../../services/NotificationUserService';
import { userService } from '../../services/UserService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './NotificationScreen.css';
import Loading from '../../components/LoadingPage'; // Import component Loading

export default function NotificationScreen() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [isLoading, setIsLoading] = useState(false); // Thêm state isLoading
  const [initialLoading, setInitialLoading] = useState(true);

  // Thêm state cho search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([fetchNotifications(), fetchUsers()]);
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      console.log('Users response:', response); // Debug log
      if (Array.isArray(response)) { // Kiểm tra response có phải array không
        // Chỉ lấy user với role 'user'
        const filteredUsers = response.filter(user => user.role === 'user');
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getAllNotifications();
      if (response.status === 200) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (notification) => {
    try {
      setEditingNotification(notification);

      // Set form data
      setFormData({
        title: notification.title,
        message: notification.content,
        type: notification.type
      });

      // If type is 'order', fetch selected users 
      if (notification.type === 'order') {
        const response = await notificationUserService.getUsersByNotificationId(notification._id);
        console.log('Selected users response:', response); // Debug log

        if (response.status === 200 && response.data.notifications) {
          // Map để lấy thông tin user từ notification_users
          const selectedUsersData = response.data.notifications
            .filter(nu => nu.user_id) // Lọc bỏ các user_id null/undefined
            .map(nu => ({
              _id: nu.user_id._id,
              username: nu.user_id.username,
              email: nu.user_id.email
            }));

          console.log('Selected users data:', selectedUsersData);
          setSelectedUsers(selectedUsersData);
        }
      } else {
        // Reset selected users nếu không phải type order
        setSelectedUsers([]);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error preparing edit:', error);
      alert(t('common.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('notifications.confirmDelete'))) {
      try {
        // Đầu tiên xóa notification để tránh race condition
        const response = await notificationService.deleteNotification(id);

        if (response.status === 200) {
          alert(t('notifications.messages.deleteSuccess'));
          fetchNotifications();
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert(t('common.error'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const notificationData = {
        title: formData.title,
        content: formData.message,
        type: formData.type,
        selectedUsers: selectedUsers.map(user => user._id)
      };

      console.log('Submitting notification data:', notificationData);

      let response;
      if (editingNotification) {
        // Cập nhật thông báo
        response = await notificationService.updateNotification(
          editingNotification._id,
          notificationData
        );

        if (response.status === 200) {
          alert(t('notifications.messages.updateSuccess'));
          setIsModalOpen(false);
          setEditingNotification(null);
          setSelectedUsers([]);
          setFormData({
            title: '',
            message: '',
            type: 'system'
          });
          fetchNotifications();
        }
      } else {
        // Tạo thông báo mới
        response = await notificationService.createNotification(notificationData);

        if (response.status === 200) {
          alert(t('notifications.messages.createSuccess'));
          setIsModalOpen(false);
          setSelectedUsers([]);
          setFormData({
            title: '',
            message: '',
            type: 'system'
          });
          fetchNotifications();
        }
      }
    } catch (error) {
      console.error('Error submitting notification:', error);
      alert(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      type
    }));

    // Clear selected users when changing from order type
    if (type !== 'order') {
      setSelectedUsers([]);
    }
  };

  // Thêm log để debug selectedUsers
  useEffect(() => {
    console.log('Selected users:', selectedUsers);
  }, [selectedUsers]);

  const handleSelectUser = (e) => {
    const userId = e.target.value;
    if (!userId) return;

    const selectedUser = users.find(user => user._id === userId);
    if (selectedUser && !selectedUsers.some(u => u._id === userId)) {
      setSelectedUsers(prev => [...prev, selectedUser]);
    }

    // Reset select value
    e.target.value = '';
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user._id !== userId));
  };

  const handleAdd = () => {
    setEditingNotification(null);
    setFormData({ title: '', message: '', type: 'system' });
    setSelectedUsers([]);
    setIsModalOpen(true);
  };

  // Thêm hàm xử lý search
  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const result = await notificationService.searchNotifications(keyword);
      if (result.status === 200) {
        setNotifications(result.data);
        setCurrentPage(1); // Reset về trang 1 khi search
      }
    } catch (error) {
      console.error('Error searching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm debounce search
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);

    // Clear timeout cũ
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set timeout mới
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        handleSearch(value);
      } else {
        fetchNotifications(); // Fetch lại toàn bộ notifications nếu search rỗng
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(notifications.length / pageSize);
  const paginatedNotifications = notifications.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <MainLayout>
      {initialLoading ? (
        <Loading />
      ) : (
        <div className="notifications-container">
          {isLoading && <Loading />}
          <div className="page-header">
            <h1>{t('notifications.title')}</h1>
            <div className="header-actions">
              <div className="search-box">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  placeholder={t('notifications.searchPlaceholder')}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <button className="add-button" onClick={() => setIsModalOpen(true)}>
                <i className="fas fa-plus"></i>
                {t('notifications.add')}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">{t('common.loading')}</div>
          ) : (
            <>
              <table className="notifications-table">
                <thead>
                  <tr>
                    <th>{t('notifications.titleColumn')}</th>
                    <th>{t('notifications.message')}</th>
                    <th>{t('notifications.type')}</th>
                    <th>{t('notifications.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedNotifications.map((notification) => (
                    <tr key={notification._id}>
                      <td>{notification.title}</td>
                      <td>{notification.content}</td>
                      <td>{t(`notifications.types.${notification.type}`)}</td>
                      <td style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          onClick={() => handleEdit(notification)}
                          className="edit-button"
                        >
                          {/* <FaEdit size={20}/> */}
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(notification._id)}
                          className="delete-button"
                        >
                          {/* <FaTrash /> */}
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* PHÂN TRANG */}
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? 'active' : ''}
                    >
                      {page}
                    </button>
                  ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </button>
              </div>
            </>
          )}

          {/* Modal Form */}
          {isModalOpen && (
            <div className="notification-modal">
              <div className="modal-content">
                <h2>{editingNotification ? t('notifications.edit') : t('notifications.add')}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>{t('notifications.titleField')}</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('notifications.messageField')}</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('notifications.typeField')}</label>
                    <div className="radio-group">
                      {['system', 'order', 'promotion'].map((type) => (
                        <label key={type}>
                          <input
                            type="radio"
                            value={type}
                            checked={formData.type === type}
                            onChange={handleTypeChange}
                          />
                          {t(`notifications.types.${type}`)}
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.type === 'order' && (
                    <div className="form-group">
                      <label>{t('notifications.selectUsers')}</label>
                      <select
                        onChange={handleSelectUser}
                        className="user-select"
                        value=""
                      >
                        <option value="">{t('notifications.selectUser')}</option>
                        {users
                          .filter(user => !selectedUsers.some(selected => selected._id === user._id))
                          .map(user => (
                            <option key={user._id} value={user._id}>
                              {user.email} ({user.username})
                            </option>
                          ))}
                      </select>

                      {selectedUsers.length > 0 && (
                        <div className="selected-users-list">
                          <h4>{t('notifications.selectedUsers')}</h4>
                          {selectedUsers.map(user => (
                            <div key={user._id} className="selected-user-item">
                              <span className="user-info">
                                <span className="email">{user.email}</span>
                                {user.username && <span className="username">({user.username})</span>}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveUser(user._id)}
                                className="remove-user-btn"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="button-group">
                    <button type="submit" className="save-button">
                      {t('common.save')}
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setIsModalOpen(false);
                        setFormData({
                          title: '',
                          message: '',
                          type: 'system'
                        });
                        setSelectedUsers([]);
                      }}
                    >
                      {t('common.cancel')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}