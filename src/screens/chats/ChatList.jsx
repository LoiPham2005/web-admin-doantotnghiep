import React, { useState, useEffect } from 'react';
import { userService } from '../../services/UserService';
import { useTranslation } from 'react-i18next';
import './ChatList.css';
import defaultAvatar from '../../assets/default-avatar.webp';

const ChatList = ({ onSelectChat, selectedUserId }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminId = localStorage.getItem('userId');

  // Add search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add effect to filter users when search changes
  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(chat => {
        const username = chat.user_id.username.toLowerCase();
        const email = chat.user_id.email.toLowerCase();
        const search = searchKeyword.toLowerCase();
        return username.includes(search) || email.includes(search);
      });
      setFilteredUsers(filtered);
    }
  }, [searchKeyword, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      console.log('Fetched users:', response);

      // Filter users and map data
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
      setFilteredUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add search handler with debounce
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);
  };

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        {/* <h2>{t('chat.userList.title')}</h2> */}
        <div className="search-box">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchChange}
            placeholder={t('chat.userList.search')}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      <div className="chat-list-content">
        {loading ? (
          <div className="loading">{t('chat.userList.loading')}</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-chats">{t('chat.userList.noUsers')}</div>
        ) : (
          filteredUsers.map(chat => (
            <div
              key={chat.user_id._id}
              className={`chat-item ${selectedUserId === chat.user_id._id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat)}
            >
              <img
                src={chat.user_id.avatar || defaultAvatar}
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