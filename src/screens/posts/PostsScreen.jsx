import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { postsService } from '../../services/PostsService';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './PostsScreen.css';

export default function PostsScreen() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    media: []
  });

  // Add new state for image previews
  const [imagePreviews, setImagePreviews] = useState([]);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Add search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postsService.getPosts();
      if (response.status === 200) {
        setPosts(response.data.data); // Access the data property from response
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);

    // Create previews for new files
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index) => {
    // Remove file from selectedFiles
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));

    // Remove preview and revoke object URL
    const removedPreview = imagePreviews[index];
    if (removedPreview?.url) {
      URL.revokeObjectURL(removedPreview.url);
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      message: post.message
    });

    // Set previews for existing media
    const previews = post.media?.map(media => ({
      url: media.url,
      isExisting: true // Flag to identify existing media
    })) || [];
    setImagePreviews(previews);

    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('admin_id', localStorage.getItem('userId'));

      // Thêm files mới nếu có
      if (selectedFiles.length > 0) {
        selectedFiles.forEach(file => {
          formDataToSend.append('media', file);
        });
      }

      let response;
      if (editingPost) {
        console.log('Updating post with data:', {
          id: editingPost._id,
          title: formData.title,
          message: formData.message,
          files: selectedFiles
        });

        response = await postsService.updatePost(editingPost._id, formDataToSend);
      } else {
        response = await postsService.createPost(formDataToSend);
      }

      if (response.status === 200) {
        alert(t(editingPost ? 'posts.messages.updateSuccess' : 'posts.messages.createSuccess'));
        resetForm();
        fetchPosts();
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert(t('common.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('posts.confirmDelete'))) {
      try {
        const response = await postsService.deletePost(id);
        if (response.status === 200) {
          alert(t('posts.messages.deleteSuccess'));
          fetchPosts();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert(t('common.error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      media: []
    });
    setSelectedFiles([]);
    // Cleanup image previews
    imagePreviews.forEach(preview => {
      if (preview.url && !preview.isExisting) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setImagePreviews([]);
    setEditingPost(null);
    setIsModalOpen(false);
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(posts.length / pageSize);
  const paginatedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Add search handler
  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const response = await postsService.searchPosts(keyword);
      if (response.data.status === 200) {
        setPosts(response.data.data);
        setCurrentPage(1); // Reset to first page
      }
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add debounce search
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        handleSearch(value);
      } else {
        fetchPosts(); // Fetch all posts if search is empty
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  return (
    <MainLayout>
      <div className="posts-container">
        <div className="page-header">
          <h1>{t('posts.title')}</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder={t('posts.searchPlaceholder')}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <button className="add-button" onClick={() => setIsModalOpen(true)}>
              <i className="fas fa-plus"></i>
              {t('posts.add')}
            </button>
          </div>
        </div>

        <table className="posts-table">
          <thead>
            <tr>
              <th>{t('posts.form.media')}</th>
              <th>{t('posts.form.title')}</th>
              <th>{t('posts.form.message')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map(post => (
              <tr key={post._id}>
                <td className="media-cell">
                  {post.media && post.media.length > 0 && (
                    <img
                      src={post.media[0].url}
                      alt={post.title}
                      className="post-image"
                    />
                  )}
                </td>
                <td>{post.title}</td>
                <td>{post.message}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(post)}
                    >
                      {/* <FaEdit /> */}
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(post._id)}
                    >
                      {/* <FaTrash /> */}
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
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

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingPost ? t('posts.edit') : t('posts.add')}</h2>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('posts.form.title')}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('posts.form.message')}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('posts.form.media')}</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept="image/*,video/*"
                  />

                  {/* Image previews */}
                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="preview-item">
                          <img src={preview.url} alt={`Preview ${index}`} />
                          <button
                            type="button"
                            className="remove-image"
                            onClick={() => handleRemoveFile(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="save-button">
                    {editingPost ? t('common.update') : t('common.save')}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={resetForm}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}