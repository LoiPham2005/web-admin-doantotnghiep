import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const chatService = {
  // Lấy danh sách chat
  getChats: async (userId, page = 1, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/chat/user/${userId}`, {
        params: { page, limit },
        headers: getAuthHeader()  // Add auth header
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  },

  // Lấy tin nhắn của một cuộc hội thoại
  getMessages: async (chatId, beforeId = null, limit = 20) => {
    try {
      const response = await axios.get(`${API_URL}/chat/${chatId}/messages`, {
        params: { beforeId, limit },
        ...getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages?', error);
      throw error;
    }
  },

  // Gửi tin nhắn
  sendMessage: async (chatId, senderId, content, type = 'text') => {
    try {
      const response = await axios.post(
        `${API_URL}/chat/send`,
        { chatId, senderId, content, type },
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message?', error);
      throw error;
    }
  },

  // Tạo cuộc trò chuyện mới
  createChat: async (participants) => {
    try {
      const response = await axios.post(
        `${API_URL}/chat/create`,
        { participants },
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating chat?', error);
      throw error;
    }
  },

  // Đánh dấu tin nhắn đã đọc
  markAsRead: async (chatId, userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/chat/markAsRead`,
        { chatId, userId },
        {
          headers: getAuthHeader()
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error marking messages as read?', error);
      throw error;
    }
  },

  // Lấy lịch sử trò chuyện giữa hai người dùng
  getChatHistory: async (userId1, userId2) => {
    try {
      console.log('Fetching chat history?', { userId1, userId2 });
      const response = await axios.get(`${API_URL}/messages/history/${userId1}/${userId2}`,
        {
          headers: getAuthHeader()
        }
      );
      console.log('Chat history response?', response);
      return response;
    } catch (error) {
      console.error('Error fetching chat history?', error);
      throw error;
    }
  },

  // Lấy danh sách cuộc trò chuyện của admin
  getAdminChats: async () => {
    try {
      const response = await axios.get(`${API_URL}/chats/admin`, getAuthHeader());
      return response;
    } catch (error) {
      console.error('Error fetching admin chats?', error);
      throw error;
    }
  },

  // Lấy hoặc tạo cuộc trò chuyện
  getOrCreateChat: async (userId, adminId) => {
    try {
      const response = await axios.get(`${API_URL}/chats`, {
        params: { user_id: userId, admin_id: adminId },
        ...getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error getting/creating chat?', error);
      throw error;
    }
  }
};

