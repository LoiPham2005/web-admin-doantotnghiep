import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { shippingService } from '../../services/ShippingService';
import Modal from '../order_list/modal/Modal';
import Loading from '../../components/LoadingPage';
import './ShippingScreen.css';

export default function ShippingScreen() {
    const { t } = useTranslation();
    const [rates, setRates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRate, setEditingRate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        minDistance: '',
        maxDistance: '',
        price: '',
        isActive: true
    });

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            setLoading(true);
            const response = await shippingService.getRates();
            if (response.success) {
                setRates(response.data || []);
            } else {
                console.error('Error:', response.message);
                alert(t('shipping.messages.fetchError'));
            }
        } catch (error) {
            console.error('Error fetching rates:', error);
            alert(error?.response?.data?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Validate form
            if (Number(formData.maxDistance) <= Number(formData.minDistance)) {
                alert(t('shipping.messages.invalidDistance'));
                return;
            }

            if (editingRate) {
                await shippingService.updateRate(editingRate._id, formData);
                alert(t('shipping.messages.updateSuccess'));
            } else {
                await shippingService.addRate(formData);
                alert(t('shipping.messages.addSuccess'));
            }

            setIsModalOpen(false);
            resetForm();
            fetchRates();
        } catch (error) {
            console.error('Error saving rate:', error);
            alert(error?.response?.data?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (rate) => {
        setEditingRate(rate);
        setFormData({
            minDistance: rate.minDistance,
            maxDistance: rate.maxDistance,
            price: rate.price,
            isActive: rate.isActive
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('shipping.messages.confirmDelete'))) {
            try {
                setLoading(true);
                await shippingService.deleteRate(id);
                alert(t('shipping.messages.deleteSuccess'));
                fetchRates();
            } catch (error) {
                console.error('Error deleting rate:', error);
                alert(error?.response?.data?.message || t('common.error'));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            setLoading(true);
            await shippingService.toggleActive(id, !currentStatus);
            alert(currentStatus ? t('shipping.messages.deactivated') : t('shipping.messages.activated'));
            fetchRates();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert(error?.response?.data?.message || t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            minDistance: '',
            maxDistance: '',
            price: '',
            isActive: true
        });
        setEditingRate(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <MainLayout>
            <div className="shipping-container">
                {loading && <Loading />}

                <div className="page-header">
                    <h1>{t('shipping.title')}</h1>
                    <button
                        className="add-button"
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        disabled={loading}
                    >
                        <i className="fas fa-plus"></i>
                        {t('shipping.addRate')}
                    </button>
                </div>

                <table className="shipping-table">
                    <thead>
                        <tr>
                            <th>{t('shipping.form.minDistance')}</th>
                            <th>{t('shipping.form.maxDistance')}</th>
                            <th>{t('shipping.form.price')}</th>
                            <th>{t('shipping.form.status')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(rates) && rates.map((rate) => (
                            <tr key={rate._id}>
                                <td>{rate.minDistance} km</td>
                                <td>{rate.maxDistance} km</td>
                                <td>{rate.price.toLocaleString('vi-VN')} VNĐ</td>
                                <td>
                                    <span className={`status-badge ${rate.isActive ? 'active' : 'inactive'}`}>
                                        {rate.isActive ? t('shipping.status.active') : t('shipping.status.inactive')}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="action-button edit-button"
                                            onClick={() => handleEdit(rate)}
                                            disabled={loading}
                                            title={t('common.edit')}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        {/* <button
                                            className="action-button delete-button"
                                            onClick={() => handleDelete(rate._id)}
                                            disabled={loading}
                                            title={t('common.delete')}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button> */}
                                        <button
                                            className={`action-button toggle-button ${!rate.isActive ? 'inactive' : ''}`}
                                            onClick={() => handleToggleActive(rate._id, rate.isActive)}
                                            disabled={loading}
                                            title={rate.isActive ? t('shipping.status.inactive') : t('shipping.status.active')}
                                        >
                                            <i className={`fas fa-${rate.isActive ? 'toggle-off' : 'toggle-on'}`}></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {Array.isArray(rates) && rates.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>
                                    {t('common.noData')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        resetForm();
                    }}
                    title={editingRate ? t('shipping.editRate') : t('shipping.addRate')} 
                >
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>{t('shipping.form.minDistance')}</label>
                            <input
                                type="number"
                                name="minDistance"
                                value={formData.minDistance}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('shipping.form.maxDistance')}</label>
                            <input
                                type="number"
                                name="maxDistance"
                                value={formData.maxDistance}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('shipping.form.price')}</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                />
                                <span>{t('shipping.form.status')}</span>
                            </label>
                        </div>

                        <div className="modal-buttons">
                            <button type="submit" className="save-button" disabled={loading}>
                                {editingRate ? t('common.update') : t('common.add')}
                            </button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    resetForm();
                                }}
                                disabled={loading}
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </MainLayout>
    );
}
