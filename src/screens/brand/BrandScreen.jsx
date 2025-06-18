import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { brandService } from '../../services/BrandService';
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

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const result = await brandService.getBrands();
      if (result.success) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
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

      // Chỉ gửi media nếu có file mới
      if (formData.media instanceof File) {
        formDataToSend.append('media', formData.media);
      }

      console.log('Submitting form data:', {
        name: formData.name,
        hasMedia: !!formData.media
      });

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
    console.log('Editing brand:', brand);
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

  const resetForm = () => {
    setFormData({
      name: '',
      media: null,
      mediaPreview: null
    });
    setEditingBrand(null);
  };

  return (
    <MainLayout>
      <div className="brands-container">
        <div className="page-header">
          <h1>{t('brands.title')}</h1>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i>
            {t('brands.addBrand')}
          </button>
        </div>

        <table className="brands-table">
          <thead>
            <tr>
              <th>{t('brands.form.image')}</th>
              <th>{t('brands.form.name')}</th>
              <th>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
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
                  <div className="action-buttons">
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
    </MainLayout>
  );
}

export default BrandScreen;