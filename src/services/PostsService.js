import axios from 'axios';
import { API_URL } from './config';
import { getAuthHeader } from '../config/authHeader';

export const postsService = {
  // Get all posts
  getPosts: async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/list`,
        {
          headers: getAuthHeader()
        }
      );
      return response;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Create new post
  createPost: async (postData) => {
    try {
      const response = await axios.post(`${API_URL}/posts/add`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      return response;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update post
  updatePost: async (id, postData) => {
    try {
      console.log('Sending update request:', {
        id,
        postData: Object.fromEntries(postData.entries())
      });

      const response = await axios.put(`${API_URL}/posts/edit/${id}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });
      return response;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/posts/delete/${id}`,
        {
          headers: getAuthHeader()
        }
      );
      return response;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Search posts
  searchPosts: async (keyword) => {
    try {
      const response = await axios.get(`${API_URL}/posts/search`, {
        params: { keyword },
        headers: getAuthHeader()
      });
      return response;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw error;
    }
  }
};