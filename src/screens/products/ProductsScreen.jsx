import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import ProductModal from './components/ProductModal';
import { productService } from '../../services/ProductService';
import { categoryService } from '../../services/CategoryService';
import { brandService } from '../../services/BrandService';
import { colorService } from '../../services/ColorService';
import { sizesService } from '../../services/SizesService';
import { shoesVariantService } from '../../services/ShoesVariantService'; // Thêm dòng này
import './ProductsScreen.css';

function ProductsScreen() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand_id: '',
    category_id: '',
    status: 'active',
    media: [],
    variants: [] // Thêm mảng variants
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  // State cho variant hiện tại
  const [currentVariant, setCurrentVariant] = useState({
    color_id: '',
    size_id: '',
    price: '',
    quantity_in_stock: '',
    status: 'available'
  });

  // Thêm state cho danh sách variants
  const [variantsList, setVariantsList] = useState([]);

  // Thêm state cho colors và sizes
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const statusOptions = [
    { value: 'active', label: t('products.status.active') },
    { value: 'out of stock', label: t('products.status.out of stock') },
    { value: 'importing goods', label: t('products.status.importing goods') }
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchColors();    // Thêm này
    fetchSizes();     // Thêm này
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const result = await productService.getProducts();
      console.log("Products result:", result); // Debug log
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await categoryService.getCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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

  // Thêm các hàm fetch
  const fetchColors = async () => {
    try {
      const result = await colorService.getColors();
      if (result.success) {
        setColors(result.data);
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  const fetchSizes = async () => {
    try {
      const result = await sizesService.getSizes();
      if (result.success) {
        setSizes(result.data);
      }
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Thêm hàm xử lý variant
  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setCurrentVariant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddVariant = () => {
    if (currentVariant.color_id && currentVariant.size_id &&
      currentVariant.price && currentVariant.quantity_in_stock) {

      // Get color and size objects
      const selectedColor = colors.find(c => c._id === currentVariant.color_id);
      const selectedSize = sizes.find(s => s._id === currentVariant.size_id);

      setVariantsList(prev => [...prev, {
        ...currentVariant,
        // Store full objects for reference
        color: selectedColor,
        size: selectedSize
      }]);

      // Reset form variant
      setCurrentVariant({
        color_id: '',
        size_id: '',
        price: '',
        quantity_in_stock: '',
        status: 'available'
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin biến thể');
    }
  };

  const handleRemoveVariant = (index) => {
    setVariantsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append basic product info
      Object.keys(formData).forEach(key => {
        if (key !== 'media' && key !== 'variants' && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append new images
      selectedImages.forEach(img => {
        if (img instanceof File) {
          formDataToSend.append('media', img);
        }
      });

      // Append new videos 
      selectedVideos.forEach(vid => {
        if (vid instanceof File) {
          formDataToSend.append('media', vid);
        }
      });

      // For keeping existing media
      if (editingProduct?.media) {
        formDataToSend.append('existing_media', JSON.stringify(
          editingProduct.media.filter(m => {
            const isImage = m.type === 'image';
            const existingUrl = m.url;
            // Keep if still in selectedImages/Videos
            return isImage ?
              selectedImages.some(img => img.url === existingUrl) :
              selectedVideos.some(vid => vid.url === existingUrl);
          })
        ));
      }

      let response;
      if (editingProduct) {
        response = await productService.updateProduct(editingProduct._id, formDataToSend);
      } else {
        response = await productService.addProduct(formDataToSend);
      }

      if (response.status === 200) {
        // Handle variants
        if (editingProduct) {
          // Update existing variants
          const existingVariants = await shoesVariantService.getVariantsByShoeId(editingProduct._id);
          const existingVariantIds = existingVariants.data?.map(v => v._id) || [];

          // Delete removed variants
          for (const variantId of existingVariantIds) {
            if (!variantsList.find(v => v._id === variantId)) {
              await shoesVariantService.deleteVariant(variantId);
            }
          }

          // Update/Add variants
          for (const variant of variantsList) {
            if (variant._id) {
              await shoesVariantService.updateVariant(variant._id, variant);
            } else {
              await shoesVariantService.addVariant({
                ...variant,
                shoes_id: editingProduct._id
              });
            }
          }
        } else if (response.data?.shoes?._id) {
          // Add variants for new product
          await Promise.all(variantsList.map(variant =>
            shoesVariantService.addVariant({
              ...variant,
              shoes_id: response.data.shoes._id
            })
          ));
        }

        alert(t(editingProduct ? 'products.messages.updateSuccess' : 'products.messages.addSuccess'));
        setIsModalOpen(false);
        resetForm();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (product) => {
    try {
      setEditingProduct(product);

      // Fetch variants
      const variantsResult = await shoesVariantService.getVariantsByShoeId(product._id);
      if (variantsResult.success) {
        // Transform variants data
        const formattedVariants = variantsResult.data.map(variant => ({
          _id: variant._id,
          color_id: variant.color_id._id,
          size_id: variant.size_id._id,
          price: variant.price,
          quantity_in_stock: variant.quantity_in_stock,
          status: variant.status,
          // Store full objects
          color: variant.color_id,
          size: variant.size_id
        }));
        setVariantsList(formattedVariants);
      }

      // Set other form data
      setFormData({
        name: product.name,
        description: product.description,
        brand_id: product.brand_id?._id || '',
        category_id: product.category_id?._id || '',
        status: product.status || 'active'
      });

      // Set media previews
      if (product.media && product.media.length > 0) {
        const images = product.media.filter(m => m.type === 'image');
        const videos = product.media.filter(m => m.type === 'video');

        setSelectedImages(images.map(img => ({
          url: img.url,
          type: 'image',
          preview: img.url
        })));

        setSelectedVideos(videos.map(vid => ({
          url: vid.url,
          type: 'video',
          preview: vid.url
        })));
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error preparing edit form:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('products.messages.confirmDelete'))) {
      try {
        const response = await productService.deleteProduct(id);
        if (response.status === 200) {
          alert(t('products.messages.deleteSuccess'));
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(t('common.error'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      brand_id: '',
      category_id: '',
      status: 'active'
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setColorInput('');
    setSizeInput('');
    setEditingProduct(null);
    setVariantsList([]); // Reset variants list
  };

  // Thêm các hàm xử lý cho hình ảnh và video
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

  // Thêm các hàm xử lý cho màu sắc và kích thước
  const handleAddColor = () => {
    if (colorInput.trim()) {
      setSelectedColors(prev => [...prev, colorInput.trim()]);
      setColorInput('');
    }
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setSelectedSizes(prev => [...prev, sizeInput.trim()]);
      setSizeInput('');
    }
  };

  const handleRemoveColor = (index) => {
    setSelectedColors(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveSize = (index) => {
    setSelectedSizes(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <MainLayout>
      <div className="products-container">
        <div className="page-header">
          <h1>{t('products.title')}</h1>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <i className="fas fa-plus"></i>
            {t('products.addProduct')}
          </button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>{t('products.form.media')}</th>
                <th>{t('products.form.name')}</th>
                <th>{t('products.form.description')}</th>
                <th>{t('products.form.brand')}</th>
                <th>{t('products.form.category')}</th>
                <th>{t('products.form.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    {product.media && product.media.length > 0 ? (
                      <img
                        src={product.media[0].url}
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.brand_id?.name || 'N/A'}</td>
                  <td>{product.category_id?.name || 'N/A'}</td>
                  <td>
                    {statusOptions.find(option => option.value === product.status)?.label || product.status}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(product)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(product._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isModalOpen && (
          <ProductModal
            isOpen={isModalOpen}
            onClose={() => {
              if (window.confirm('Bạn có chắc muốn hủy? Các thông tin đã nhập sẽ không được lưu.')) {
                setIsModalOpen(false);
                resetForm();
              }
            }}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            editingProduct={editingProduct}
            brands={brands}
            categories={categories}
            colors={colors}
            setColors={setColors}  // Thêm dòng này
            sizes={sizes}
            selectedImages={selectedImages}
            selectedVideos={selectedVideos}
            handleImageSelect={handleImageSelect}
            handleVideoSelect={handleVideoSelect}
            handleRemoveImage={handleRemoveImage}
            handleRemoveVideo={handleRemoveVideo}
            colorInput={colorInput}
            setColorInput={setColorInput}
            sizeInput={sizeInput}
            setSizeInput={setSizeInput}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            handleAddColor={handleAddColor}
            handleAddSize={handleAddSize}
            handleRemoveColor={handleRemoveColor}
            handleRemoveSize={handleRemoveSize}
            currentVariant={currentVariant}
            handleVariantChange={handleVariantChange}
            handleAddVariant={handleAddVariant}
            variantsList={variantsList}
            handleRemoveVariant={handleRemoveVariant}
            statusOptions={statusOptions}  // Thêm dòng này
          />
        )}
      </div>
    </MainLayout>
  );
}

export default ProductsScreen;