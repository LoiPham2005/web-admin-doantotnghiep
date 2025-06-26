import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/ChatsService';
import io from 'socket.io-client';
import { API_URL } from '../../services/config';
import './WindowChat.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { DOMAIN } from '../../setup/setup';

const WindowChat = ({ chat, userId }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [chatInfo, setChatInfo] = useState(null);

  useEffect(() => {
    // Khởi tạo kết nối socket
    const socket = io(DOMAIN, {
      // const socket = io('wss://backend-doantotnghiep-wy5h.onrender.com', {
      transports: ['websocket', 'polling'], // Thêm polling để backup
      withCredentials: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);

      // Join chat room
      socket.emit('join chat', {
        userId: userId,
        partnerId: chat.user_id._id
      });
    });

    // Lắng nghe chat info
    socket.on('chat info', (info) => {
      console.log('Received chat info:', info);
      setChatInfo(info);
    });

    // Lắng nghe tin nhắn mới
    socket.on('message received', (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToBottom, 100);
    });

    // Fetch message history
    fetchMessages();

    // Cleanup khi unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave', {
          userId: userId,
          partnerId: chat.user_id._id
        });
        socketRef.current.disconnect();
      }
    };
  }, [chat.user_id._id, userId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await chatService.getChatHistory(userId, chat.user_id._id);

      if (response.status === 200 && response.data.data.messages) {
        setMessages(response.data.data.messages);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;

    try {
      // Chờ chat info trước khi gửi tin nhắn
      if (!chatInfo) {
        console.log('Waiting for chat info...');
        return;
      }

      console.log('Sending message:', {
        chat_id: chatInfo._id,
        sender_id: userId,
        content: content
      });

      socketRef.current.emit('new message', {
        chat_id: chatInfo._id,
        sender_id: userId,
        content: content
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Format thời gian tin nhắn
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    if (isNaN(messageDate.getTime())) return '';

    return messageDate.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="window-chat">
      <div className="chat-header">
        <img
          src={chat.participants[1]?.avatar}
          alt={chat.participants[1]?.username}
          className="chat-avatar"
        />
        <div className="chat-info">
          <div className="chat-name">
            {chat.participants[1]?.username}
          </div>
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">{t('chat.window.loading')}</div>
        ) : (
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.sender_id._id === userId ? 'sent' : 'received'}`}
              >
                <div className="message-content">{message.content}</div>
                <div className="message-time">
                  {formatMessageTime(message.sent_at || message.createdAt)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.window.placeholder')}
            className="message-input"
          />
          <button type="submit" className="send-button">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default WindowChat;