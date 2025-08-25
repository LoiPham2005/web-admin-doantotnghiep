import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { productService } from '../../services/ProductService';
import './ProductStockScreen.css';

function ProductStockScreen() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;

  // Thêm state cho search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Thêm states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Thêm state và function mới
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Thêm state loading modal
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'out of stock':
        return '#f44336';
      case 'importing goods':
        return '#2196F3';
      case 'stop selling':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const calculateTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((total, variant) => total + variant.quantity_in_stock, 0);
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Thêm hàm xử lý search
  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const response = await productService.searchProducts(keyword);
      if (response.success) {
        setProducts(response.data.shoes);
        setCurrentPage(1); // Reset về trang 1 khi search
      }
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm debounce search
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
        fetchProducts(); // Fetch lại toàn bộ products nếu search rỗng
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  // Sửa lại hàm handleViewDetail
  const handleViewDetail = async (product) => {
    try {
      setLoadingModal(true); // Show loading trước khi fetch

      // Fetch reviews
      const response = await productService.getProductReviews(product._id);
      console.log("Reviews response:", response);

      if (response.status === 200) {
        setReviews(response.data.reviews);
        setSelectedProduct(product);
        setShowDetailModal(true); // Chỉ show modal sau khi có data
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoadingModal(false); // Hide loading
    }
  };

  // Thêm hàm đóng modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
    setReviews([]); // Clear reviews khi đóng modal
    setLoadingReviews(false); // Reset loading state
  };

  // Thêm component ProductDetailModal 
  const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;

    const getStarRating = (rating) => {
      return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{t('productStock.detail.title')}</h2>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            {/* Product details section */}
            <div className="product-detail">
              <div className="detail-image">
                {product.media && product.media.length > 0 && (
                  <img src={product.media[0].url} alt={product.name} />
                )}
              </div>
              <div className="detail-info">
                <h3>{product.name}</h3>
                <p className="brand">{product.brand_id?.name}</p>
                <p className="description">{product.description}</p>

                <div className="status-section">
                  <div
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(product.status) }}
                  >
                    {t(`products.status.${product.status}`)}
                  </div>
                </div>

                <div className="variants-section">
                  <h4>{t('productStock.detail.variants')}</h4>
                  <div className="variants-grid">
                    {product.variants?.map((variant, idx) => (
                      <div key={idx} className="variant-detail-item">
                        <div className="variant-header">
                          <div
                            className="color-preview"
                            style={{ backgroundColor: variant.color_id?.value }}
                          />
                          <span>Size: {variant.size_id?.size_value}</span>
                        </div>
                        <div className="variant-body">
                          <div className="price">
                            {variant.price?.toLocaleString('vi-VN')}đ
                          </div>
                          <div className="stock">
                            {t('productStock.detail.inStock')}: {variant.quantity_in_stock}
                          </div>
                          <div
                            className="status"
                            style={{
                              backgroundColor: getStatusColor(variant.status)
                            }}
                          >
                            {t(`products.status.${variant.status}`)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Add Reviews Section */}
            <div className="reviews-section">
              <h4>{t('productStock.detail.reviews')}</h4>
              {loadingReviews ? (
                <div className="loading-reviews">
                  <div className="loading-spinner" />
                  <p>Đang tải đánh giá...</p>
                </div>
              ) : reviews?.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-name">
                            {review.user_id?.username}
                            {review.user_id?.avatar && (
                              <img
                                src={review.user_id.avatar}
                                alt="avatar"
                                className="reviewer-avatar"
                              />
                            )}
                          </span>
                          <span className="review-date">
                            {new Date(review.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="rating">
                          <span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                          <span className="rating-value">{review.rating}/5</span>
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      {review.media && review.media.length > 0 && (
                        <div className="review-media">
                          {review.media.map((media, index) => (
                            <div key={index} className="media-item">
                              {media.url.includes('video') ? (
                                <video
                                  src={media.url}
                                  controls
                                  className="review-video"
                                />
                              ) : (
                                <img
                                  src={media.url}
                                  alt={`Review ${index + 1}`}
                                  className="review-image"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews">Chưa có đánh giá nào</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="stock-container">
        <div className="page-header">
          <h1>{t('productStock.title')}</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder={t('productStock.searchPlaceholder')}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
          </div>
        </div>

        <div className="stock-grid">
          {paginatedProducts.map(product => {
            const totalStock = calculateTotalStock(product.variants);
            return (
              <div
                key={product._id}
                className="stock-card"
                onClick={() => handleViewDetail(product)}
              >
                <div className="stock-image">
                  {product.media && product.media.length > 0 && (
                    <img
                      src={product.media[0].url}
                      alt={product.name}
                    />
                  )}
                </div>
                <div className="stock-info">
                  <h3>{product.name}</h3>
                  <p>{product.brand_id?.name}</p>
                  <div className="stock-details">
                    <div className="stock-quantity">
                      <span>{t('productStock.quantity')}</span>
                      <strong>{totalStock}</strong>
                    </div>
                    <div
                      className="stock-status"
                      style={{ backgroundColor: getStatusColor(product.status) }}
                    >
                      {t(`products.status.${product.status}`)}
                    </div>
                  </div>
                  <div className="variant-details">
                    {product.variants && product.variants.map((variant, idx) => (
                      <div key={idx} className="variant-item">
                        <span className="color-dot" style={{ backgroundColor: variant.color_id?.value }}></span>
                        <span>Size {variant.size_id?.size_value}: {variant.quantity_in_stock}</span>
                      </div>
                    ))}
                  </div>
                  <div className="stock-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.min((totalStock / 100) * 100, 100)}%`,
                        backgroundColor: getStatusColor(product.status)
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}

        {/* Loading overlay */}
        {loadingModal && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner" />
              <p>Đang tải thông tin...</p>
            </div>
          </div>
        )}

        {/* Chỉ show modal khi không còn loading */}
        {!loadingModal && showDetailModal && selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default ProductStockScreen;