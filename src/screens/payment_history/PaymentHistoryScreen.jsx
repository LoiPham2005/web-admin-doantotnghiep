import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import PaymentHistoryService from '../../services/PaymentHistoryService';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import "react-datepicker/dist/react-datepicker.css";
import './PaymentHistoryScreen.css';
import Loading from '../../components/LoadingPage';

const PaymentHistoryScreen = () => {
    const { t } = useTranslation();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);
    const pageSize = 10; // Kích thước trang, thay đổi nếu cần

    // Add search states
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                await fetchPayments();
            } finally {
                setInitialLoading(false);
            }
        };
        init();
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [currentPage]);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await PaymentHistoryService.getAllPayments(currentPage);
            console.log('Payment history response:', response);

            if (response.status === 200) {
                setPayments(response.data.payments);
                setTotalPages(Math.ceil(response.data.total / pageSize));
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'pending';
            case 'processing':
                return 'processing';
            case 'shipping':
                return 'shipping';
            case 'delivered':
                return 'completed';
            case 'cancelled':
                return 'cancelled';
            case 'returned':
                return 'returned';
            default:
                return 'pending';
        }
    };

    // Sửa lại các hàm export
    const exportToExcel = async () => {
        try {
            // Lấy toàn bộ dữ liệu từ API
            const response = await PaymentHistoryService.getAllPayments(1, Number.MAX_SAFE_INTEGER);
            const allPayments = response.data.payments;

            const data = allPayments.map((payment, index) => ({
                'STT': index + 1,
                'Mã đơn hàng': payment.order_id?._id?.slice(-6) || 'N/A',
                'Người dùng': payment.user_id?.username || 'N/A',
                'Email': payment.user_id?.email || 'N/A',
                'Số tiền': payment.amount?.toLocaleString('vi-VN') + 'đ',
                'Thời gian': formatDate(payment.createdAt),
                'Phương thức': payment.order_id?.payment_method === 'COD' ? 'Tiền mặt' : 'Chuyển khoản',
                'Trạng thái': convertStatus(payment.order_id?.status)
            }));

            const ws = XLSX.utils.json_to_sheet(data);

            // Set cột width
            ws['!cols'] = [
                { width: 5 },  // STT
                { width: 15 }, // Mã đơn hàng
                { width: 20 }, // Người dùng 
                { width: 25 }, // Email
                { width: 15 }, // Số tiền
                { width: 20 }, // Thời gian
                { width: 15 }, // Phương thức
                { width: 15 }, // Trạng thái
            ];

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Lịch sử thanh toán");
            XLSX.writeFile(wb, "lich_su_thanh_toan.xlsx");

        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Có lỗi xảy ra khi xuất Excel');
        }
    };

    const exportToPDF = async () => {
        try {
            // Lấy toàn bộ dữ liệu
            const response = await PaymentHistoryService.getAllPayments(1, Number.MAX_SAFE_INTEGER);
            const allPayments = response.data.payments;

            // Tạo HTML template với styles
            const htmlContent = `
                <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; }
                            h2 { color: #333; text-align: center; margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { 
                                border: 1px solid #ddd; 
                                padding: 8px;
                                font-size: 12px;
                            }
                            th { 
                                background-color: #f4f4f4; 
                                font-weight: bold;
                                color: #333;
                            }
                            tr:nth-child(even) { background-color: #f9f9f9; }
                        </style>
                    </head>
                    <body>
                        <h2>Lịch sử thanh toán</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã đơn hàng</th>
                                    <th>Người dùng</th>
                                    <th>Email</th>
                                    <th>Số tiền</th>
                                    <th>Thời gian</th>
                                    <th>Phương thức</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${allPayments.map((payment, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>${payment.order_id?._id?.slice(-6) || 'N/A'}</td>
                                        <td>${payment.user_id?.username || 'N/A'}</td>
                                        <td>${payment.user_id?.email || 'N/A'}</td>
                                        <td>${payment.amount?.toLocaleString('vi-VN')}đ</td>
                                        <td>${formatDate(payment.createdAt)}</td>
                                        <td>${payment.order_id?.payment_method === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}</td>
                                        <td>${convertStatus(payment.order_id?.status)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            const opt = {
                margin: 10,
                filename: 'lich_su_thanh_toan.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    logging: true,
                    useCORS: true
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'landscape'
                }
            };

            // Tạo element tạm thời
            const element = document.createElement('div');
            element.innerHTML = htmlContent;
            document.body.appendChild(element);

            // Generate PDF
            html2pdf()
                .set(opt)
                .from(element)
                .save()
                .then(() => {
                    document.body.removeChild(element);
                })
                .catch(err => {
                    console.error('PDF generation error:', err);
                    alert('Có lỗi khi tạo PDF');
                });

        } catch (error) {
            console.error('Error exporting to PDF:', error);
            alert('Có lỗi xảy ra khi xuất PDF');
        }
    };

    // Add search handler
    const handleSearch = async (keyword) => {
        try {
            setLoading(true);
            const response = await PaymentHistoryService.searchPayments(keyword);
            if (response.status === 200) {
                setPayments(response.data.data.payments || []);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Error searching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add debounce search
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
                fetchPayments(); // Fetch lại toàn bộ nếu search rỗng
            }
        }, 500);

        setSearchTimeout(timeoutId);
    };

    // Thêm hàm convertStatus 
    const convertStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'processing':
                return 'Đang xử lý';
            case 'shipping':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            case 'returned':
                return 'Đã trả hàng';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Chờ xử lý';
        }
    };

    return (
        <MainLayout>
            {initialLoading ? (
                <Loading />
            ) : (
                <div className="payment-history-container">
                    {loading && <Loading />}
                    <div className="header-container">
                        <h2 className="page-title">{t('paymentHistory.title')}</h2>
                        <div className="header-actions">
                            <div className="search-box">
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={handleSearchChange}
                                    placeholder={t('paymentHistory.searchPlaceholder')}
                                    className="search-input"
                                />
                                <i className="fas fa-search search-icon"></i>
                            </div>
                            <div className="export-buttons">
                                <button onClick={exportToExcel} className="export-button excel">
                                    {t('paymentHistory.export.excel')}
                                </button>
                                <button onClick={exportToPDF} className="export-button pdf">
                                    {t('paymentHistory.export.pdf')}
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Đang tải...</div>
                    ) : (
                        <>
                            <div id="payment-table-container" className="table-container">
                                <table className="payment-table">
                                    <thead>
                                        <tr>
                                            <th>STT</th>  {/* Thêm cột STT */}
                                            <th>{t('paymentHistory.table.orderId')}</th>
                                            <th>{t('paymentHistory.table.username')}</th>
                                            <th>{t('paymentHistory.table.email')}</th>
                                            <th>{t('paymentHistory.table.amount')}</th>
                                            <th>{t('paymentHistory.table.date')}</th>
                                            <th>{t('paymentHistory.table.paymentMethod')}</th>
                                            <th>{t('paymentHistory.table.status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments && payments.length > 0 ? (
                                            payments.map((payment, index) => (
                                                <tr key={payment._id}>
                                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>  {/* STT */}
                                                    <td>{payment.order_id?._id?.slice(-6) || 'N/A'}</td>
                                                    <td>{payment.user_id?.username || 'N/A'}</td>
                                                    <td>{payment.user_id?.email || 'N/A'}</td>
                                                    <td>{payment.amount?.toLocaleString('vi-VN')}đ</td>
                                                    <td>{formatDate(payment.createdAt)}</td>
                                                    <td>{payment.order_id?.payment_method || 'N/A'}</td>
                                                    <td>
                                                        <span className={`status ${getStatusClass(payment.order_id?.status)}`}>
                                                            {convertStatus(payment.order_id?.status)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : null
                                            // (
                                            //     payments.length === 0 && (
                                            //         <tr>
                                            //             <td colSpan="6" className="no-data">
                                            //                 {t('paymentHistory.noData')}
                                            //             </td>
                                            //         </tr>
                                            //     )
                                            // )
                                        }
                                    </tbody>
                                </table>
                            </div>

                            {totalPages > 0 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                    >
                                         {t('common.pagination.First')}
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        {t('common.pagination.Previous')}
                                    </button>
                                    {Array.from({ length: totalPages - 1 }, (_, i) => i + 1)
                                        .map(page => {
                                            // Chỉ hiển thị các trang thỏa mãn điều kiện
                                            if (
                                                page === 1 || // Trang đầu
                                                page === totalPages - 1 || // Trang cuối
                                                (page >= currentPage - 1 && page <= currentPage + 1) // Các trang xung quanh trang hiện tại
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={page === currentPage ? 'active' : ''}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            }
                                            // Thêm dấu ... nếu có khoảng cách
                                            if (
                                                page === currentPage - 2 ||
                                                page === currentPage + 2
                                            ) {
                                                return <span key={page}>...</span>;
                                            }
                                            return null;
                                        })}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        {t('common.pagination.Next')}
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        disabled={currentPage === totalPages}
                                    >
                                        {t('common.pagination.Last')}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </MainLayout>
    );
};

export default PaymentHistoryScreen;