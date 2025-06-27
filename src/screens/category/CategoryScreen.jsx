import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { categoryService } from '../../services/CategoryService';
import './CategoryScreen.css';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/Loading';

function CategoryScreen() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    media: null,
    mediaPreview: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const pageSize = 15;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await categoryService.getCategories(true);
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await categoryService.toggleCategoryActive(id);
      await fetchCategories();
      alert(t(`categories.messages.${currentStatus ? 'deactivated' : 'activated'}`));
    } catch (error) {
      console.error('Error toggling category:', error);
      alert(t('common.error'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'media' && files[0]) {
      setFormData(prev => ({
        ...prev,
        media: files[0],
        mediaPreview: URL.createObjectURL(files[0])
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const categoryData = new FormData();
      categoryData.append('name', formData.name.trim());

      if (formData.media) {
        categoryData.append('media', formData.media);
      }

      let response;
      if (editingCategory) {
        response = await categoryService.updateCategory(editingCategory._id, categoryData);
      } else {
        response = await categoryService.addCategory(categoryData);
      }

      if (response.status === 200) {
        alert(editingCategory ? t('categories.messages.updateSuccess') : t('categories.messages.addSuccess'));
        setIsModalOpen(false);
        resetForm();
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.response?.data?.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      media: null,
      mediaPreview: category.media
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('categories.messages.confirmDelete'))) {
      try {
        const response = await categoryService.deleteCategory(id);
        if (response.status === 200) {
          alert(t('categories.messages.deleteSuccess'));
          await fetchCategories();
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(t('common.error'));
      }
    }
  };

  const handleSearch = async (keyword) => {
    try {
      setIsLoading(true);
      const result = await categoryService.searchCategories(keyword);
      if (result.success) {
        setCategories(result.data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error searching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        handleSearch(value);
      } else {
        fetchCategories();
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      media: null,
      mediaPreview: null
    });
    setEditingCategory(null);
  };

  const totalPages = Math.ceil(categories.length / pageSize);
  const paginatedCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <MainLayout>
      {isLoading && <Loading />}
      <div className="categories-container">
        <div className="page-header">
          <h1>{t('categories.title')}</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder={t('categories.searchPlaceholder')}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <button className="add-button" onClick={() => setIsModalOpen(true)}>
              <i className="fas fa-plus"></i>
              {t('categories.addCategory')}
            </button>
          </div>
        </div>

        <table className="categories-table">
          <thead>
            <tr>
              <th>{t('categories.form.image')}</th>
              <th>{t('categories.form.name')}</th>
              <th>{t('categories.form.status')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map(category => (
              <tr key={category._id}>
                <td className="image-cell">
                  <img
                    src={category.media}
                    alt={category.name}
                    className="category-image"
                  />
                </td>
                <td>{category.name}</td>
                <td>
                  <span className={`status-badge ${category.is_active ? 'active' : 'inactive'}`}>
                    {category.is_active ? t('common.active') : t('common.inactive')}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="toggle-button"
                      onClick={() => handleToggleActive(category._id, category.is_active)}
                      title={t(category.is_active ? 'categories.deactivate' : 'categories.activate')}
                    >
                      <i className={`fas fa-${category.is_active ? 'eye' : 'eye-slash'}`}></i>
                    </button>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(category)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(category._id)}
                    >
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
                <h2>{editingCategory ? t('categories.editCategory') : t('categories.addCategory')}</h2>
                <button
                  className="close-button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('categories.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('categories.form.media')}</label>
                  <div className="media-upload-container">
                    {(formData.mediaPreview) && (
                      <div className="media-preview">
                        <img
                          src={formData.mediaPreview}
                          alt="Preview"
                        />
                        <button
                          type="button"
                          className="remove-media"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              media: null,
                              mediaPreview: null
                            }));
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      name="media"
                      onChange={handleInputChange}
                      accept="image/*"
                      required={!editingCategory}
                      style={{ display: formData.mediaPreview ? 'none' : 'block' }}
                    />
                  </div>
                </div>

                <div className="modal-buttons">
                  <button type="button" onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}>
                    {t('common.cancel')}
                  </button>
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? t('common.loading') : (editingCategory ? t('common.update') : t('common.add'))}
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

export default CategoryScreen;