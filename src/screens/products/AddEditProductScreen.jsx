import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChromePicker } from 'react-color';
import MainLayout from '../../layouts/MainLayout';
import Loading from '../../components/LoadingPage';
import { productService } from '../../services/ProductService';
import { categoryService } from '../../services/CategoryService';
import { brandService } from '../../services/BrandService';
import { colorService } from '../../services/ColorService';
import { sizesService } from '../../services/SizesService';
import { shoesVariantService } from '../../services/ShoesVariantService';
import './ProductsScreen.css';
import { useLocation } from 'react-router-dom'

function AddEditProductScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const passedProduct = location.state?.product;

  console.log('ID param:', id);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand_id: '',
    category_id: '',
    status: 'active',
    media: [],
  });

  // Media states
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);

  // Categories, Brands, Colors, Sizes states
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Variant states
  const [currentVariant, setCurrentVariant] = useState({
    color_id: '',
    size_id: '',
    price: '',
    quantity_in_stock: '',
    status: 'available'
  });
  const [variantsList, setVariantsList] = useState([]);
  const [isEditingVariant, setIsEditingVariant] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);

  // Color picker states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', value: '#000000' });
  const [showNewColorForm, setShowNewColorForm] = useState(false);

  // Status options
  const statusOptions = [
    { value: 'active', label: t('products.status.active') },
    { value: 'out_of_stock', label: t('products.status.out_of_stock') },
    { value: 'importing_goods', label: t('products.status.importing_goods') },
    { value: 'hidden', label: t('products.status.hidden') }
  ];

  // Variant status options
  const variantStatusOptions = [
    { value: 'available', label: t('products.modal.variantStatus.available') },
    { value: 'out_of_stock', label: t('products.modal.variantStatus.out_of_stock') },
    { value: 'discontinued', label: t('products.modal.variantStatus.discontinued') }
  ];

  useEffect(() => {
    fetchInitialData();
    if (isEditing) {
      fetchProductData();
    }
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [categoriesRes, brandsRes, colorsRes, sizesRes] = await Promise.all([
        categoryService.getCategories(),
        brandService.getBrands(),
        colorService.getColors(),
        sizesService.getSizes()
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (brandsRes.success) setBrands(brandsRes.data);
      if (colorsRes.success) setColors(colorsRes.data);
      if (sizesRes.success) setSizes(sizesRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      const response = await productService.getProductById(id);
      
      if (response.success) {
        const product = response.data;
        
        // Set form data
        setFormData({
          name: product.name,
          description: product.description,
          brand_id: product.brand_id?._id || '',
          category_id: product.category_id?._id || '',
          status: product.status 
        });

        // Set media
        if (product.media && product.media.length > 0) {
          const images = product.media
            .filter(m => m.type === 'image')
            .map(img => ({ url: img.url, type: 'image' }));
          const videos = product.media
            .filter(m => m.type === 'video')
            .map(vid => ({ url: vid.url, type: 'video' }));

          setSelectedImages(images);
          setSelectedVideos(videos);
        }

        // Set variants
        if (product.variants && product.variants.length > 0) {
          const populatedVariants = product.variants.map(variant => ({
            _id: variant._id,
            color_id: variant.color_id?._id,
            size_id: variant.size_id?._id,
            price: variant.price,
            quantity_in_stock: variant.quantity_in_stock,
            status: variant.status ,
            color: variant.color_id,
            size: variant.size_id
          }));
          setVariantsList(populatedVariants);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert(t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedImages(prev => [...prev, ...imageFiles]);
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files);
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    setSelectedVideos(prev => [...prev, ...videoFiles]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    setSelectedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVariant = () => {
    if (!currentVariant.color_id || !currentVariant.size_id ||
      !currentVariant.price || !currentVariant.quantity_in_stock) {
      alert(t('products.modal.fillAllVariant'));
      return;
    }

    const selectedColor = colors.find(c => c._id === currentVariant.color_id);
    const selectedSize = sizes.find(s => s._id === currentVariant.size_id);

    if (isEditingVariant) {
      const updatedVariants = [...variantsList];
      updatedVariants[editingVariantIndex] = {
        ...currentVariant,
        color: selectedColor,
        size: selectedSize
      };
      setVariantsList(updatedVariants);
      setIsEditingVariant(false);
      setEditingVariantIndex(null);
    } else {
      setVariantsList(prev => [...prev, {
        ...currentVariant,
        color: selectedColor,
        size: selectedSize
      }]);
    }

    setCurrentVariant({
      color_id: '',
      size_id: '',
      price: '',
      quantity_in_stock: '',
      status: 'available'
    });
  };

  const handleEditVariant = (variant, index) => {
    setCurrentVariant({
      _id: variant._id, // Thêm dòng này để giữ lại ID
      color_id: variant.color_id || variant.color?._id,
      size_id: variant.size_id || variant.size?._id,
      price: variant.price,
      quantity_in_stock: variant.quantity_in_stock,
      status: variant.status || 'available'
    });
    setEditingVariantIndex(index);
    setIsEditingVariant(true);
  };

  // Sửa lại hàm updateVariant
  const handleUpdateVariant = () => {
    if (currentVariant.color_id && currentVariant.size_id &&
      currentVariant.price && currentVariant.quantity_in_stock) {

      const selectedColor = colors.find(c => c._id === currentVariant.color_id);
      const selectedSize = sizes.find(s => s._id === currentVariant.size_id);

      const updatedVariants = [...variantsList];
      updatedVariants[editingVariantIndex] = {
        ...currentVariant, // Giữ lại _id từ currentVariant
        color: selectedColor,
        size: selectedSize
      };
      
      setVariantsList(updatedVariants);
      setIsEditingVariant(false);
      setEditingVariantIndex(null);

      // Reset form
      setCurrentVariant({
        color_id: '',
        size_id: '',
        price: '',
        quantity_in_stock: '',
        status: 'available'
      });
    } else {
      alert(t('products.modal.fillAllVariant'));
    }
  };

  const handleRemoveVariant = (index) => {
    if (window.confirm(t('products.modal.confirmDeleteVariant'))) {
      setVariantsList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      
      // Append basic product info
      Object.keys(formData).forEach(key => {
        if (key !== 'media' && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Handle media
      let existingMedia = [];
      selectedImages.forEach(img => {
        if (img.url) {
          existingMedia.push({ type: 'image', url: img.url });
        } else {
          formDataToSend.append('media', img);
        }
      });

      selectedVideos.forEach(vid => {
        if (vid.url) {
          existingMedia.push({ type: 'video', url: vid.url });
        } else {
          formDataToSend.append('media', vid);
        }
      });

      if (existingMedia.length > 0) {
        formDataToSend.append('existing_media', JSON.stringify(existingMedia));
      }

      let response;
      if (isEditing) {
        response = await productService.updateProduct(id, formDataToSend);
        
        // Xử lý variants
        if (variantsList.length > 0) {
          const currentVariants = await shoesVariantService.getVariantsByShoeId(id);
          
          if (currentVariants.success) {
            const existingVariantIds = currentVariants.data.map(v => v._id);
            
            // Xóa variants đã bị loại bỏ
            for (const variantId of existingVariantIds) {
              if (!variantsList.find(v => v._id === variantId)) {
                await shoesVariantService.deleteVariant(variantId);
              }
            }

            // Thêm/cập nhật variants
            await Promise.all(variantsList.map(variant => {
              const variantData = {
                shoes_id: id,
                color_id: variant.color_id || variant.color?._id,
                size_id: variant.size_id || variant.size?._id,
                price: variant.price,
                quantity_in_stock: variant.quantity_in_stock,
                status: variant.status || 'available'
              };

              if (variant._id) {
                // Cập nhật variant hiện có, không gửi _id trong dữ liệu cập nhật
                return shoesVariantService.updateVariant(variant._id, variantData);
              } else {
                // Thêm variant mới
                return shoesVariantService.addVariant(variantData);
              }
            }));
          }
        }
      } else {
        // Thêm sản phẩm mới
        response = await productService.addProduct(formDataToSend);
        
        if (response.success || response.status === 200) {
          const productId = response.data.shoes._id;
          
          // Thêm variants cho sản phẩm mới
          if (variantsList.length > 0) {
            await Promise.all(variantsList.map(variant => {
              const variantData = {
                shoes_id: productId,
                color_id: variant.color_id || variant.color?._id,
                size_id: variant.size_id || variant.size?._id,
                price: variant.price,
                quantity_in_stock: variant.quantity_in_stock,
                status: variant.status || 'available'
              };
              return shoesVariantService.addVariant(variantData);
            }));
          }
        }
      }

      alert(t(isEditing ? 'products.messages.updateSuccess' : 'products.messages.addSuccess'));
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm(t('products.confirmCancel'))) {
      navigate('/products');
    }
  };

  // Thêm hàm xử lý ColorPicker
  const handleColorPickerChange = (color) => {
    setNewColor(prev => ({ ...prev, value: color.hex }));
  };

  // Thêm hàm thêm màu mới
  const handleAddNewColor = async () => {
    try {
      if (!newColor.name || !newColor.value) {
        alert(t('products.modal.fillAllColor'));
        return;
      }

      const result = await colorService.addColor(newColor);
      if (result.status === 200) {
        const updatedColors = [...colors, result.data];
        setColors(updatedColors);

        // Tự động chọn màu mới cho variant
        handleVariantChange({
          target: {
            name: 'color_id',
            value: result.data._id
          }
        });

        setNewColor({ name: '', value: '#000000' });
        setShowNewColorForm(false);
        setShowColorPicker(false);

        alert(t('products.modal.addColorSuccess'));
      }
    } catch (error) {
      alert(t('products.modal.addColorError') + error.message);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <MainLayout>
      <div className="add-edit-product-container">
        <div className="page-header">
          <h1>{isEditing ? t('products.editProduct') : t('products.addProduct')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {/* Basic Info Section */}
          <div className="form-section">
            <h3>{t('products.modal.basicInfo')}</h3>
            <div className="form-group">
              <label>{t('products.modal.name')} *</label>
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

            <div className="form-row">
              <div className="form-group">
                <label>{t('products.modal.brand')} *</label>
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
                <label>{t('products.modal.category')} *</label>
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
                />
                <div className="selected-files">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="selected-file">
                      <img
                        src={file.url || URL.createObjectURL(file)}
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
                />
                <div className="selected-files">
                  {selectedVideos.map((file, index) => (
                    <div key={index} className="selected-file">
                      <video
                        src={file.url || URL.createObjectURL(file)}
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
                  <label>{t('products.modal.color')} *</label>
                  <div className="color-select-container">
                    <select
                      name="color_id"
                      value={currentVariant.color_id}
                      onChange={handleVariantChange}
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
                  <label>{t('products.modal.size')} *</label>
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
                  <label>{t('products.modal.price')} *</label>
                  <input
                    type="number"
                    name="price"
                    value={currentVariant.price}
                    onChange={handleVariantChange}
                    min="0"
                    step="1000"
                  />
                </div>

                <div className="form-group">
                  <label>{t('products.modal.quantity')} *</label>
                  <input
                    type="number"
                    name="quantity_in_stock"
                    value={currentVariant.quantity_in_stock}
                    onChange={handleVariantChange}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>{t('products.modal.variantStatus.title')}</label>
                  <select
                    name="status"
                    value={currentVariant.status}
                    onChange={handleVariantChange}
                  >
                    {variantStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="variant-buttons">
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className={`variant-button ${isEditingVariant ? 'update' : 'add'}`}
                >
                  {isEditingVariant
                    ? t('products.modal.updateVariant')
                    : t('products.modal.addVariant')}
                </button>
                {isEditingVariant && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingVariant(false);
                      setEditingVariantIndex(null);
                      setCurrentVariant({
                        color_id: '',
                        size_id: '',
                        price: '',
                        quantity_in_stock: '',
                        status: 'available'
                      });
                    }}
                    className="variant-button cancel"
                  >
                    {t('products.modal.cancel')}
                  </button>
                )}
              </div>
            </div>

            {/* Variants List */}
            {variantsList.length > 0 && (
              <div className="variants-list">
                <h4>{t('products.modal.variantList')}</h4>
                {variantsList.map((variant, index) => (
                  <div key={variant._id || index} className="variant-item">
                    <div className="variant-info">
                      <span>
                        {t('products.modal.color')}:{' '}
                        {variant.color?.name ||
                          colors.find(c => c._id === variant.color_id)?.name}
                      </span>
                      <span>
                        {t('products.modal.size')}:{' '}
                        {variant.size?.size_value ||
                          sizes.find(s => s._id === variant.size_id)?.size_value}
                      </span>
                      <span>
                        {t('products.modal.price')}:{' '}
                        {variant.price?.toLocaleString('vi-VN')}đ
                      </span>
                      <span>
                        {t('products.modal.quantity')}:{' '}
                        {variant.quantity_in_stock}
                      </span>
                      <span className={`variant-status ${variant.status}`}>
                        {variantStatusOptions.find(
                          opt => opt.value === variant.status
                        )?.label || variant.status}
                      </span>
                    </div>
                    <div className="variant-actions">
                      <button
                        type="button"
                        onClick={() => handleEditVariant(variant, index)}
                        className="edit-variant-btn"
                        title={t('products.modal.editVariant')}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="remove-variant-btn"
                        title={t('products.modal.deleteVariant')}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
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

          <div className="form-buttons">
            <button type="button" onClick={handleCancel}>
              {t('common.cancel')}
            </button>
            <button type="submit">
              {isEditing ? t('common.update') : t('common.add')}
            </button>
          </div>
        </form>


      </div>
    </MainLayout>
  );
}

export default AddEditProductScreen;