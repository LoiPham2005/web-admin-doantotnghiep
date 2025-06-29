import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { bannerService } from '../../services/BannerService';
import './BannerScreen.css';
import Loading from '../../components/LoadingPage'; // Import component Loading

const BannerScreen = () => {
    const { t } = useTranslation();
    const [banners, setBanners] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // Thêm state cho preview
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Thêm state isLoading
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                await fetchBanners();
            } finally {
                setInitialLoading(false);
            }
        };
        init();
    }, []);

    // Cleanup preview URL khi component unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const result = await bannerService.getBanners();
            if (result.success) {
                setBanners(result.data);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Tạo preview URL cho ảnh
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Chỉ kiểm tra file bắt buộc khi thêm mới
            if (!editingBanner && !selectedFile) {
                alert(t('banners.messages.pleaseSelectImage'));
                return;
            }

            const formData = new FormData();
            if (selectedFile) {
                formData.append('media', selectedFile);
            }

            if (editingBanner) {
                await bannerService.updateBanner(editingBanner._id, formData);
                alert(t('banners.messages.updateSuccess'));
            } else {
                await bannerService.addBanner(formData);
                alert(t('banners.messages.addSuccess'));
            }

            setIsModalOpen(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            setEditingBanner(null);
            fetchBanners();

        } catch (error) {
            console.error('Error saving banner:', error);
            alert(error?.response?.data?.message || t('common.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setPreviewUrl(banner.media); // Hiển thị ảnh hiện tại khi edit
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('banners.messages.confirmDelete'))) {
            try {
                await bannerService.deleteBanner(id);
                fetchBanners();
                alert(t('banners.messages.deleteSuccess'));
            } catch (error) {
                console.error('Error deleting banner:', error);
                alert(error?.message || t('common.error'));
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        setEditingBanner(null);
    };

    return (
        <MainLayout>
            {initialLoading ? (
                <Loading />
            ) : (
                <div className="banners-container">
                    {isLoading && <Loading />}
                    <div className="page-header">
                        <h1>{t('banners.title')}</h1>
                        <button
                            className="add-button"
                            onClick={() => setIsModalOpen(true)}
                            disabled={banners.length >= 3}
                        >
                            <i className="fas fa-plus"></i>
                            {t('banners.addBanner')}
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading">{t('common.loading')}</div>
                    ) : (
                        <div className="banners-grid">
                            {banners.map((banner) => (
                                <div key={banner._id} className="banner-item">
                                    <img src={banner.media} alt="Banner" />
                                    <div className="banner-actions">
                                        <button
                                            onClick={() => handleEdit(banner)}
                                            className="edit-button"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(banner._id)}
                                            className="delete-button"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>{editingBanner ? t('banners.editBanner') : t('banners.addBanner')}</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>{t('banners.form.image')}</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            required={!editingBanner}
                                        />

                                        {/* Preview section */}
                                        {(previewUrl || editingBanner?.media) && (
                                            <div className="image-preview">
                                                <img
                                                    src={previewUrl || editingBanner?.media}
                                                    alt="Preview"
                                                />
                                                <button
                                                    type="button"
                                                    className="remove-image"
                                                    onClick={handleRemoveFile}
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="modal-buttons">
                                        <button
                                            type="submit"
                                            disabled={!selectedFile && !editingBanner}
                                        >
                                            {editingBanner ? t('common.update') : t('common.add')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setSelectedFile(null);
                                                setPreviewUrl(null);
                                                setEditingBanner(null);
                                            }}
                                        >
                                            {t('common.cancel')}
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
};

export default BannerScreen;