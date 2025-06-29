import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { brandService } from '../../services/BrandService';
import Loading from '../../components/LoadingPage';
import './BrandScreen.css';

function BrandScreen() {
  const { t } = useTranslation();
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    media: null,
    mediaPreview: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const pageSize = 15;

  useEffect(() => {
    const init = async () => {
      try {
        await fetchBrands();
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, []);

  const fetchBrands = async () => {
    try {
      const result = await brandService.getBrands(true);
      if (result.success) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await brandService.toggleBrandActive(id);
      await fetchBrands();
      alert(t(`brands.messages.${currentStatus ? 'deactivated' : 'activated'}`));
    } catch (error) {
      console.error('Error toggling brand:', error);
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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());

      if (formData.media instanceof File) {
        formDataToSend.append('media', formData.media);
      }

      if (editingBrand) {
        await brandService.updateBrand(editingBrand._id, formDataToSend);
        alert(t('brands.messages.updateSuccess'));
      } else {
        await brandService.addBrand(formDataToSend);
        alert(t('brands.messages.addSuccess'));
      }

      setIsModalOpen(false);
      resetForm();
      fetchBrands();
    } catch (error) {
      console.error('Submit error:', error);
      alert(error.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      media: null,
      mediaPreview: brand.media
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('brands.messages.confirmDelete'))) {
      try {
        await brandService.deleteBrand(id);
        alert(t('brands.messages.deleteSuccess'));
        fetchBrands();
      } catch (error) {
        alert(error.message || t('common.error'));
      }
    }
  };

  const handleSearch = async (keyword) => {
    try {
      setIsLoading(true);
      const result = await brandService.searchBrands(keyword);
      if (result.success) {
        setBrands(result.data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error searching brands:', error);
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
        fetchBrands();
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
    setEditingBrand(null);
  };

  const totalPages = Math.ceil(brands.length / pageSize);
  const paginatedBrands = brands.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <MainLayout>
      {initialLoading ? (
        <Loading />
      ) : (
        <div className="brands-container">
          {isLoading && <Loading />}
          <div className="page-header">
            <h1>{t('brands.title')}</h1>
            <div className="header-actions">
              <div className="search-box">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  placeholder={t('brands.searchPlaceholder')}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
              <button className="add-button" onClick={() => setIsModalOpen(true)}>
                <i className="fas fa-plus"></i>
                {t('brands.addBrand')}
              </button>
            </div>
          </div>

          <table className="brands-table">
            <thead>
              <tr>
                <th>{t('brands.form.image')}</th>
                <th>{t('brands.form.name')}</th>
                <th>{t('brands.form.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.map(brand => (
                <tr key={brand._id}>
                  <td className="image-cell">
                    <img
                      src={brand.media}
                      alt={brand.name}
                      className="brand-image"
                    />
                  </td>
                  <td>{brand.name}</td>
                  <td>
                    <span className={`status-badge ${brand.is_active ? 'active' : 'inactive'}`}>
                      {brand.is_active ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="toggle-button"
                        onClick={() => handleToggleActive(brand._id, brand.is_active)}
                        title={t(brand.is_active ? 'brands.deactivate' : 'brands.activate')}
                      >
                        <i className={`fas fa-${brand.is_active ? 'eye' : 'eye-slash'}`}></i>
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(brand)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(brand._id)}
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
                  <h2>{editingBrand ? t('brands.editBrand') : t('brands.addBrand')}</h2>
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
                    <label>{t('brands.form.name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>{t('brands.form.media')}</label>
                    <div className="media-upload-container">
                      {formData.mediaPreview && (
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
                        required={!editingBrand?.media && !formData.media}
                        disabled={formData.mediaPreview}
                      />
                    </div>
                  </div>

                  <div className="modal-buttons">
                    <button type="button" onClick={() => setIsModalOpen(false)}>
                      {t('common.cancel')}
                    </button>
                    <button type="submit" disabled={isLoading}>
                      {isLoading ? t('common.loading') : (editingBrand ? t('common.update') : t('common.add'))}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </MainLayout>
  );
}

export default BrandScreen;