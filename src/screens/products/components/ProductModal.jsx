import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChromePicker } from 'react-color';
import { colorService } from '../../../services/ColorService'; // Thêm dòng này

const ProductModal = ({
    isOpen,
    onClose,
    formData,
    handleInputChange,
    handleSubmit,
    editingProduct,
    brands,
    categories,
    colors,
    setColors,        // Thêm prop này
    sizes,
    selectedImages,
    selectedVideos,
    handleImageSelect,
    handleVideoSelect,
    handleRemoveImage,
    handleRemoveVideo,
    colorInput,
    setColorInput,
    sizeInput,
    setSizeInput,
    selectedColors,
    selectedSizes,
    handleAddColor,
    handleAddSize,
    handleRemoveColor,
    handleRemoveSize,
    currentVariant,
    handleVariantChange,
    handleAddVariant,
    variantsList,
    handleRemoveVariant,
    statusOptions,  // Thêm dòng này
}) => {
    const { t } = useTranslation();

    // Thêm state trong component
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState({ name: '', value: '#000000' });
    const [showNewColorForm, setShowNewColorForm] = useState(false);

    // Thêm hàm kiểm tra variants
    const hasVariants = variantsList && variantsList.length > 0;

    // Thêm các hàm xử lý màu
    const handleColorPickerChange = (color) => {
        setNewColor(prev => ({ ...prev, value: color.hex }));
    };

    const handleAddNewColor = async () => {
        try {
            if (!newColor.name || !newColor.value) {
                alert('Vui lòng nhập đầy đủ thông tin màu');
                return;
            }

            const result = await colorService.addColor(newColor);
            if (result.status === 200) {
                // Cập nhật danh sách màu
                const updatedColors = [...colors, result.data];
                setColors(updatedColors);

                // Chọn màu mới thêm vào variant
                handleVariantChange({
                    target: {
                        name: 'color_id',
                        value: result.data._id
                    }
                });

                // Reset form
                setNewColor({ name: '', value: '#000000' });
                setShowNewColorForm(false);
                setShowColorPicker(false);
            }
        } catch (error) {
            alert('Lỗi khi thêm màu mới: ' + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal large">
                <div className="modal-header">
                    <h2>{editingProduct ? t('products.editProduct') : t('products.addProduct')}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info Section */}
                    <div className="form-section">
                        <h3>{t('products.modal.basicInfo')}</h3>
                        <div className="form-group">
                            <label>{t('products.modal.name')}</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder={t('products.modal.name')}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('products.modal.description')}</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder={t('products.modal.description')}
                            />
                        </div>

                        {/* Dropdown selectors */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>{t('products.modal.brand')}</label>
                                <select
                                    name="brand_id"
                                    value={formData.brand_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{t('products.modal.selectBrand')}</option>
                                    {brands.map(brand => (
                                        <option key={brand._id} value={brand._id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{t('products.modal.category')}</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{t('products.modal.selectCategory')}</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{t('products.modal.status')}</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="form-section">
                        <h3>{t('products.modal.media')}</h3>
                        <div className="media-inputs">
                            <div className="form-group">
                                <label>{t('products.modal.images')}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="file-input"
                                    placeholder={t('products.modal.selectImages')}
                                />
                                <div className="selected-files">
                                    {selectedImages.map((file, index) => (
                                        <div key={index} className="selected-file">
                                            <img
                                                src={file.preview || file.url || URL.createObjectURL(file)}
                                                alt="preview"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>{t('products.modal.videos')}</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    multiple
                                    onChange={handleVideoSelect}
                                    className="file-input"
                                    placeholder={t('products.modal.selectVideos')}
                                />
                                <div className="selected-files">
                                    {selectedVideos.map((file, index) => (
                                        <div key={index} className="selected-file">
                                            <video
                                                src={file.preview || file.url || URL.createObjectURL(file)}
                                                controls
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVideo(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className="form-section">
                        <h3>{t('products.modal.variants')}</h3>
                        <div className="variant-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('products.modal.color')}</label>
                                    <div className="color-select-container">
                                        <select
                                            name="color_id"
                                            value={currentVariant.color_id}
                                            onChange={handleVariantChange}
                                            required={!hasVariants}
                                        >
                                            <option value="">{t('products.modal.selectColor')}</option>
                                            {colors.map(color => (
                                                <option key={color._id} value={color._id}>
                                                    {color.name}
                                                </option>
                                            ))}
                                        </select>
                                        {currentVariant.color_id && (
                                            <div
                                                className="color-preview"
                                                style={{
                                                    backgroundColor: colors.find(c => c._id === currentVariant.color_id)?.value
                                                }}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            className="add-color-button"
                                            onClick={() => setShowNewColorForm(true)}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{t('products.modal.size')}</label>
                                    <select
                                        name="size_id"
                                        value={currentVariant.size_id}
                                        onChange={handleVariantChange}
                                    >
                                        <option value="">{t('products.modal.selectSize')}</option>
                                        {sizes.map(size => (
                                            <option key={size._id} value={size._id}>
                                                {size.size_value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>{t('products.modal.price')}</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={currentVariant.price}
                                        onChange={handleVariantChange}
                                        placeholder={t('products.modal.price')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('products.modal.quantity')}</label>
                                    <input
                                        type="number"
                                        name="quantity_in_stock"
                                        value={currentVariant.quantity_in_stock}
                                        onChange={handleVariantChange}
                                        placeholder={t('products.modal.quantity')}
                                    />
                                </div>
                            </div>

                            <button type="button" onClick={handleAddVariant} className="add-variant-button">
                                {t('products.modal.addVariant')}
                            </button>
                        </div>

                        {/* Variants List */}
                        {variantsList && variantsList.length > 0 && (
                            <div className="variants-list">
                                <h4>{t('products.modal.variantList')}</h4>
                                {variantsList.map((variant, index) => {
                                    // Find color and size objects using ID
                                    const color = colors.find(c => c._id === variant.color_id);
                                    const size = sizes.find(s => s._id === variant.size_id);

                                    return (
                                        <div key={variant._id || index} className="variant-item">
                                            <div className="variant-info">
                                                <span>Màu: {color?.name || 'N/A'}</span>
                                                <span>Size: {size?.size_value || 'N/A'}</span>
                                                <span>Giá: {variant.price?.toLocaleString('vi-VN')}đ</span>
                                                <span>Số lượng: {variant.quantity_in_stock}</span>

                                                {/* Color preview */}
                                                {color && (
                                                    <div
                                                        className="color-preview"
                                                        style={{
                                                            backgroundColor: color.value,
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            border: '1px solid #ddd'
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveVariant(index)}
                                                className="remove-variant-btn"
                                            >
                                                {t('products.modal.remove')}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Form thêm màu mới */}
                    {showNewColorForm && (
                        <div className="new-color-form">
                            <div className="form-group">
                                <label>{t('products.modal.newColorName')}</label>
                                <input
                                    type="text"
                                    value={newColor.name}
                                    onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder={t('products.modal.newColorName')}
                                />
                            </div>

                            <div className="form-group">
                                <label>{t('products.modal.newColorValue')}</label>
                                <div className="color-picker-container">
                                    <input
                                        type="text"
                                        value={newColor.value}
                                        onChange={(e) => setNewColor(prev => ({ ...prev, value: e.target.value }))}
                                        placeholder={t('products.modal.newColorValue')}
                                    />
                                    <div
                                        className="color-preview"
                                        style={{ backgroundColor: newColor.value }}
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                    />
                                </div>

                                {showColorPicker && (
                                    <div className="color-picker-popover">
                                        <div
                                            className="color-picker-cover"
                                            onClick={() => setShowColorPicker(false)}
                                        />
                                        <ChromePicker
                                            color={newColor.value}
                                            onChange={handleColorPickerChange}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="new-color-buttons">
                                <button
                                    type="button"
                                    onClick={handleAddNewColor}
                                    className="add-button"
                                >
                                    {t('products.modal.add')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNewColorForm(false);
                                        setShowColorPicker(false);
                                        setNewColor({ name: '', value: '#000000' });
                                    }}
                                    className="cancel-button"
                                >
                                    {t('products.modal.cancel')}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>{t('products.modal.cancel')}</button>
                        <button type="submit">{editingProduct ? t('products.modal.update') : t('products.modal.add')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(ProductModal); // Thêm React.memo để tối ưu hiệu năng