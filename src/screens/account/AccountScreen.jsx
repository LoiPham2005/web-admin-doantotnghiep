import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { accountService } from '../../services/AccountService';
import './AccountScreen.css';
import defaultAvatar from '../../assets/default-avatar.webp';

function AccountScreen() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Add search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await accountService.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Add search handler
  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const result = await accountService.searchUsers(keyword);
      if (result.success) {
        setUsers(result.data); // Cập nhật danh sách users với kết quả tìm kiếm
        setCurrentPage(1); // Reset về trang 1
      } else {
        console.error('Search failed:', result.message);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add debounce search
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
        fetchUsers(); // Fetch lại toàn bộ users nếu search rỗng
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const handleToggleActive = async (userId, currentStatus) => {
    if (window.confirm(t('accounts.confirmToggle'))) {
      try {
        setLoading(true);
        const response = await accountService.toggleUserActive(userId);
        if (response.status === 200) {
          // Cập nhật lại trạng thái trong danh sách
          setUsers(users.map(user =>
            user._id === userId
              ? { ...user, is_active: !currentStatus }
              : user
          ));
          alert(t('accounts.toggleSuccess'));
        }
      } catch (error) {
        console.error('Error toggling user:', error);
        alert(t('common.error'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <MainLayout>
      <div className="accounts-container">
        <div className="page-header">
          <h1>{t('accounts.title')}</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder={t('accounts.searchPlaceholder')}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
          </div>
        </div>

        <table className="accounts-table">
          <thead>
            <tr>
              <th>STT</th>  {/* Thêm cột STT */}
              <th>{t('accounts.form.avatar')}</th>
              <th>{t('accounts.form.username')}</th>
              <th>{t('accounts.form.email')}</th>
              <th>{t('accounts.form.phone')}</th>
              <th>{t('accounts.form.status')}</th>
              <th>{t('accounts.form.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>  {/* STT */}
                <td>
                  <img
                    src={user.avatar || defaultAvatar}
                    alt={user.username}
                    className="user-avatar"
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone || t('accounts.noPhone')}</td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? t('accounts.status.active') : t('accounts.status.inactive')}
                  </span>
                </td>
                <td>
                  <button
                    className={`toggle-button ${user.is_active ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleActive(user._id, user.is_active)}
                  >
                    {user.is_active ? t('accounts.deactivate') : t('accounts.activate')}
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
             {t('common.pagination.First')}
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            {t('common.pagination.Previous')}
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
            {t('common.pagination.Next')}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {t('common.pagination.Last')}
          </button>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default AccountScreen;