import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import PaymentHistoryService from '../../services/PaymentHistoryService';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';
import "react-datepicker/dist/react-datepicker.css";
import './PaymentHistoryScreen.css';

const PaymentHistoryScreen = () => {
    const { t } = useTranslation();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

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
                setTotalPages(Math.ceil(response.data.total / 10));
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
            case 'pending': return 'pending';
            case 'completed': return 'completed';
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    const exportToExcel = () => {
        const data = payments.map((payment, index) => ({
            'STT': index + 1,
            'Mã đơn hàng': payment.order_id?._id?.slice(-6) || 'N/A',
            'Người dùng': payment.user_id?.username || 'N/A',
            'Số tiền': payment.amount?.toLocaleString('vi-VN') + 'đ',
            'Thời gian': formatDate(payment.createdAt),
            'Phương thức': payment.order_id?.payment_method || 'N/A',
            'Trạng thái': payment.order_id?.status || 'Chờ xử lý'
        }));

        const ws = XLSX.utils.json_to_sheet(data);

        // Set cột width cho STT
        ws['!cols'] = [
            { width: 5 },  // STT
            { width: 15 }, // Mã đơn hàng
            { width: 20 }, // Người dùng
            { width: 15 }, // Số tiền
            { width: 20 }, // Thời gian
            { width: 15 }, // Phương thức
            { width: 15 }, // Trạng thái
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Lịch sử thanh toán");
        XLSX.writeFile(wb, "lich_su_thanh_toan.xlsx");
    };

    const exportToPDF = () => {
        const element = document.getElementById('payment-table-container');
        const opt = {
            margin: 1,
            filename: 'lich_su_thanh_toan.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <MainLayout>
            <div className="payment-history-container">
                <div className="header-container">
                    <h2 className="page-title">{t('paymentHistory.title')}</h2>
                    <div className="export-buttons">
                        <button onClick={exportToExcel} className="export-button excel">
                            {t('paymentHistory.export.excel')}
                        </button>
                        <button onClick={exportToPDF} className="export-button pdf">
                            {t('paymentHistory.export.pdf')}
                        </button>
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
                                        <th>{t('paymentHistory.table.orderId')}</th>
                                        <th>{t('paymentHistory.table.username')}</th>
                                        <th>{t('paymentHistory.table.amount')}</th>
                                        <th>{t('paymentHistory.table.date')}</th>
                                        <th>{t('paymentHistory.table.paymentMethod')}</th>
                                        <th>{t('paymentHistory.table.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments && payments.length > 0 ? (
                                        payments.map((payment) => (
                                            <tr key={payment._id}>
                                                <td>{payment.order_id?._id?.slice(-6) || 'N/A'}</td>
                                                <td>{payment.user_id?.username || 'N/A'}</td>
                                                <td>{payment.amount?.toLocaleString('vi-VN')}đ</td>
                                                <td>{formatDate(payment.createdAt)}</td>
                                                <td>{payment.order_id?.payment_method || 'N/A'}</td>
                                                <td>
                                                    <span className={`status ${getStatusClass(payment.order_id?.status)}`}>
                                                        {payment.order_id?.status || 'Chờ xử lý'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-data">
                                                {t('paymentHistory.noData')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={currentPage === i + 1 ? 'active' : ''}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default PaymentHistoryScreen;