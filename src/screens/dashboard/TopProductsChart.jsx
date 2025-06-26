import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { statisticsService } from '../../services/StatisticsService';
import { useTranslation } from 'react-i18next';
import './TopProductsChart.css';

const TopProductsChart = () => {
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopProducts();
    }, [dateRange]);

    const fetchTopProducts = async () => {
        try {
            setLoading(true);
            const response = await statisticsService.getTopProducts(
                dateRange.startDate,
                dateRange.endDate
            );

            if (response.status === 200 && response.data) {
                setTopProducts(response.data.products); // Sửa lại ở đây
                console.log('Fetched products:', response.data.products);
            }
        } catch (error) {
            console.error('Error fetching top products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (!price) return "0 đ";
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const calculateMinPrice = (variants) => {
        if (!variants || variants.length === 0) return 0;
        return Math.min(...variants.map(v => v.price));
    };

    return (
        <div className="top-products-container">
            <h2 className="top-products-title">{t('statistics.topProducts.title')}</h2>
            <div className="date-picker-container">
                <DatePicker
                    selected={dateRange.startDate}
                    onChange={date => setDateRange(prev => ({ ...prev, startDate: date }))}
                    selectsStart
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    placeholderText={t('statistics.salesChart.from')}
                />
                <span>{t('statistics.salesChart.to')}</span>
                <DatePicker
                    selected={dateRange.endDate}
                    onChange={date => setDateRange(prev => ({ ...prev, endDate: date }))}
                    selectsEnd
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    minDate={dateRange.startDate}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    placeholderText={t('statistics.salesChart.to')}
                />
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : (
                <div className="table-container">
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>{t('statistics.topProducts.image')}</th>
                                <th>{t('statistics.topProducts.name')}</th>
                                <th>{t('statistics.topProducts.brand')}</th>
                                <th>{t('statistics.topProducts.category')}</th>
                                {/* <th>{t('statistics.topProducts.price')}</th> */}
                                <th>{t('statistics.topProducts.quantity')}</th>
                                <th>{t('statistics.topProducts.revenue')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(topProducts) && topProducts.map((product, index) => (
                                <tr key={product._id} className="product-row">
                                    <td className="rank-cell">{index + 1}</td>
                                    <td className="image-cell">
                                        <img
                                            src={product.media?.[0]?.url || '/placeholder.png'}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    </td>
                                    <td className="title-cell">{product.name}</td>
                                    <td className="brand-cell">{product.brand_id?.name}</td>
                                    <td className="category-cell">{product.category_id?.name}</td>
                                    {/* <td className="price-cell">
                                        {formatPrice(calculateMinPrice(product.variants))}
                                    </td> */}
                                    <td className="quantity-cell">{product.totalSold}</td>
                                    <td className="revenue-cell">
                                        {product.totalRevenue?.toLocaleString('vi-VN')}đ
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TopProductsChart;