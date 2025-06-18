import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { accountService } from '../../services/AccountService';
import './AccountScreen.css';

function AccountScreen() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <MainLayout>
      <div className="accounts-container">
        <div className="page-header">
          <h1>{t('accounts.title')}</h1>
        </div>

        <table className="accounts-table">
          <thead>
            <tr>
              <th>{t('accounts.form.avatar')}</th>
              <th>{t('accounts.form.username')}</th>
              <th>{t('accounts.form.email')}</th>
              <th>{t('accounts.form.phone')}</th>
              <th>{t('accounts.form.sex')}</th>
              <th>{t('accounts.form.birthDate')}</th>
              <th>{t('accounts.form.createdAt')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>
                  <img 
                    src={user.avatar || '/images/default-avatar.png'} 
                    alt={user.username}
                    className="user-avatar"
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phone || t('accounts.noPhone')}</td>
                <td>{user.sex || t('accounts.noGender')}</td>
                <td>
                  {user.birth_date ? 
                    new Date(user.birth_date).toLocaleDateString() : 
                    t('accounts.noBirthDate')}
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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