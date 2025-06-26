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
              <div key={product._id} className="stock-card">
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
      </div>
    </MainLayout>
  );
}

export default ProductStockScreen;