import React, { useState, useEffect } from 'react';
import { userService } from '../../services/UserService';
import { useTranslation } from 'react-i18next';
import './ChatList.css';

const ChatList = ({ onSelectChat, selectedUserId }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      console.log('Fetched users:', response);

      // Lọc chỉ lấy users
      const filteredUsers = response.filter(user => user.role === 'user').map(user => ({
        user_id: user,
        participants: [
          { _id: adminId },
          {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
            email: user.email
          }
        ]
      }));

      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>{t('chat.userList.title')}</h2>
      </div>

      <div className="chat-list-content">
        {loading ? (
          <div className="loading">{t('chat.window.loading')}</div>
        ) : users.length === 0 ? (
          <div className="no-chats">{t('chat.window.noUsers')}</div>
        ) : (
          users.map(chat => (
            <div
              key={chat.user_id._id}
              className={`chat-item ${selectedUserId === chat.user_id._id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <img
                src={chat.user_id.avatar || '/default-avatar.png'}
                alt={chat.user_id.username}
                className="chat-avatar"
              />
              <div className="chat-info">
                <div className="chat-name">{chat.user_id.username}</div>
                <div className="chat-email">{chat.user_id.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;