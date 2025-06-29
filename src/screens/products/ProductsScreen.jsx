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
import Loading from '../../components/LoadingPage';

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const statusOptions = [
    { value: 'active', label: t('products.status.active') },
    { value: 'out of stock', label: t('products.status.out of stock') },
    { value: 'importing goods', label: t('products.status.importing goods') },
    { value: 'hidden', label: t('products.status.hidden') } // Thêm option hidden
  ];

  // Thêm state cho search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

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

  const [isEditingVariant, setIsEditingVariant] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);

  const handleAddVariant = () => {
    if (currentVariant.color_id && currentVariant.size_id &&
      currentVariant.price && currentVariant.quantity_in_stock) {

      const selectedColor = colors.find(c => c._id === currentVariant.color_id);
      const selectedSize = sizes.find(s => s._id === currentVariant.size_id);

      if (isEditingVariant) {
        // Đang sửa variant
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
        // Thêm variant mới
        setVariantsList(prev => [...prev, {
          ...currentVariant,
          color: selectedColor,
          size: selectedSize
        }]);
      }

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

      // Prepare existing media array
      let existingMedia = [];

      // Add existing images that are still selected
      selectedImages.forEach(img => {
        if (img.url) { // If it has url, it's an existing image
          existingMedia.push({
            type: 'image',
            url: img.url
          });
        } else if (img instanceof File) {
          formDataToSend.append('media', img);
        }
      });

      // Add existing videos that are still selected  
      selectedVideos.forEach(vid => {
        if (vid.url) { // If it has url, it's an existing video
          existingMedia.push({
            type: 'video',
            url: vid.url
          });
        } else if (vid instanceof File) {
          formDataToSend.append('media', vid);
        }
      });

      // Append existing media as JSON string
      formDataToSend.append('existing_media', JSON.stringify(existingMedia));

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
        resetForm(); // Gọi resetForm để reset toàn bộ form
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

      setFormData({
        name: product.name,
        description: product.description,
        brand_id: product.brand_id?._id || '',
        category_id: product.category_id?._id || '',
        status: product.status || 'active'
      });

      // Set media previews
      if (product.media && product.media.length > 0) {
        const images = product.media
          .filter(m => m.type === 'image')
          .map(img => ({
            url: img.url,
            type: 'image'
          }));

        const videos = product.media
          .filter(m => m.type === 'video')
          .map(vid => ({
            url: vid.url,
            type: 'video'
          }));

        setSelectedImages(images);
        setSelectedVideos(videos);
      } else {
        setSelectedImages([]);
        setSelectedVideos([]);
      }

      // Fetch và set variants với thông tin đầy đủ
      try {
        const variantsResult = await shoesVariantService.getVariantsByShoeId(product._id);
        console.log('Variants result:', variantsResult);

        if (variantsResult.success) {
          const populatedVariants = variantsResult.data.map(variant => ({
            _id: variant._id,
            color_id: variant.color_id?._id,
            size_id: variant.size_id?._id,
            price: variant.price,
            quantity_in_stock: variant.quantity_in_stock,
            status: variant.status || 'available',
            // Store complete objects
            color: variant.color_id,
            size: variant.size_id
          }));

          console.log('Populated variants:', populatedVariants);
          setVariantsList(populatedVariants);
        }
      } catch (error) {
        console.error('Error fetching variants:', error);
      }

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error preparing edit form:', error);
      alert('Có lỗi xảy ra khi chuẩn bị form chỉnh sửa');
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
      status: 'active',
      media: []
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setColorInput('');
    setSizeInput('');
    setEditingProduct(null);
    setVariantsList([]); // Reset variants list

    // Reset form variant
    setCurrentVariant({
      color_id: '',
      size_id: '',
      price: '',
      quantity_in_stock: '',
      status: 'available'
    });
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

  const handleClose = () => {
    if (window.confirm(t('products.modal.confirmCancel'))) {
      setShowNewColorForm(false);
      setShowColorPicker(false);
      onClose();
    }
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Thêm hàm xử lý search
  const handleSearch = async (keyword) => {
    try {
      setIsLoading(true);
      const result = await productService.searchProducts(keyword);
      if (result.success) {
        setProducts(result.data.shoes);
        setCurrentPage(1); // Reset về trang 1 khi search
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm debounce search
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);

    // Clear timeout cũ
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set timeout mới
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        handleSearch(value);
      } else {
        fetchProducts(); // Fetch lại toàn bộ products nếu search rỗng
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  return (
    <MainLayout>
      {isLoading && <Loading />}
      <div className="products-container">
        <div className="page-header">
          <h1>{t('products.title')}</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder={t('products.searchPlaceholder')}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <button className="add-button" onClick={() => setIsModalOpen(true)}>
              <i className="fas fa-plus"></i>
              {t('products.addProduct')}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className="products-table">
              <thead>
                <tr>
                  <th>STT</th>  {/* Thêm cột STT */}
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
                {paginatedProducts.map((product, index) => (
                  <tr key={product._id}>
                    <td>{(currentPage - 1) * pageSize + index + 1}</td>  {/* STT */}
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
          </>
        )}

        {isModalOpen && (
          <ProductModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              resetForm();
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
            setCurrentVariant={setCurrentVariant} // Thêm prop này
            handleVariantChange={handleVariantChange}
            onAddVariant={handleAddVariant}
            variantsList={variantsList}
            setVariantsList={setVariantsList}
            handleRemoveVariant={handleRemoveVariant}
            statusOptions={statusOptions}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default ProductsScreen;