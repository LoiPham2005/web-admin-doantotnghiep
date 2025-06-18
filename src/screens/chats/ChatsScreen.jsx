import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import ChatList from './ChatList';
import WindowChat from './WindowChat';
import './ChatsScreen.css';
import { useTranslation } from 'react-i18next';

export default function ChatsScreen() {
  const { t } = useTranslation();
  const [selectedChat, setSelectedChat] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('User not logged in');
    }
  }, [userId]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <MainLayout>
      <div className="chats-container">
        <div className="chat-layout">
          <div className="chat-sidebar">
            <ChatList
              onSelectChat={handleSelectChat}
              selectedUserId={selectedChat?.participants[1]?._id}
            />
http://localhost:5173/notification          </div>
          <div className="chat-main">
            {selectedChat ? (
              <WindowChat chat={selectedChat} userId={userId} />
            ) : (
              <div className="no-chat-selected">
                {t('chat.window.selectUser')}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
