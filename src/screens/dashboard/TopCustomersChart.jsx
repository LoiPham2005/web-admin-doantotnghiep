import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { statisticsService } from '../../services/StatisticsService';
import { useTranslation } from 'react-i18next';
import './TopCustomersChart.css';
import defaultAvatar from '../../assets/default-avatar.webp';

const TopCustomersChart = () => {
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTopCustomers();
    }, [dateRange]);

    const fetchTopCustomers = async () => {
        try {
            setLoading(true);
            const response = await statisticsService.getTopCustomers(
                dateRange.startDate,
                dateRange.endDate
            );
            if (response.status === 200) {
                setTopCustomers(response.data);
            }
        } catch (error) {
            console.error('Error fetching top customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatBirthDate = (birthDate) => {
        if (!birthDate) return t('accounts.noBirthDate');
        try {
            // Convert birthDate to Date object and format it
            const date = new Date(birthDate);
            if (isNaN(date.getTime())) return t('accounts.noBirthDate');

            return new Date(birthDate).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting birth date:', error);
            return t('accounts.noBirthDate');
        }
    };

    return (
        <div className="top-customers-container">
            <h2 className="top-customers-title">{t('statistics.topCustomers.title')}</h2>
            <div className="date-picker-container">
                <DatePicker
                    selected={dateRange.startDate}
                    onChange={date => setDateRange(prev => ({ ...prev, startDate: date }))}
                    selectsStart
                    startDate={dateRange.startDate}
                    endDate={dateRange.endDate}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker"
                    placeholderText={t('statistics.topCustomersChart.fromDate')}
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
                    placeholderText={t('statistics.topCustomersChart.toDate')}
                />
            </div>

            {loading ? (
                <div className="loading">{t('common.loading')}</div>
            ) : (
                <div className="table-container">
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>{t('statistics.topCustomers.avatar')}</th>
                                <th>{t('statistics.topCustomers.name')}</th>
                                <th>{t('statistics.topCustomers.email')}</th>
                                <th>{t('statistics.topCustomers.phone')}</th>
                                <th>{t('statistics.topCustomers.birthDate')}</th>
                                <th>{t('statistics.topCustomers.orders')}</th>
                                <th>{t('statistics.topCustomers.spent')}</th>
                                <th>{t('statistics.topCustomers.lastPurchase')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topCustomers.map((customer, index) => (
                                <tr key={customer._id} className="customer-row">
                                    <td className="rank-cell">{index + 1}</td>
                                    <td className="image-cell">
                                        <img
                                            src={customer.avatar || defaultAvatar}
                                            alt={customer.username}
                                            className="customer-image"
                                        />
                                    </td>
                                    <td className="name-cell">{customer.username}</td>
                                    <td className="email-cell">{customer.email}</td>
                                    <td className="phone-cell">{customer.phone}</td>
                                    {/* <td className="birth-date-cell">
                                        {formatBirthDate(customer.birthDate)} 
                                    </td> */}
                                    <td>
                                        {customer.birthDate ?
                                            new Date(customer.birthDate).toLocaleDateString() :
                                            t('accounts.noBirthDate')}
                                    </td>
                                    <td className="orders-cell">{customer.totalOrders}</td>
                                    <td className="spent-cell">
                                        {customer.totalSpent.toLocaleString('vi-VN')}đ
                                    </td>
                                    <td className="last-purchase-cell">
                                        {customer.lastPurchase}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div >
    );
};

export default TopCustomersChart;