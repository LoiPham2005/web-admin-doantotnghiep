import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import MainLayout from '../../layouts/MainLayout';
import SalesDetailsChart from './SalesDetailsChart';
import { statisticsService } from '../../services/StatisticsService';
import { useTheme } from '../../contexts/ThemeContext';
import './Dashboard.css';
import TopProductsChart from './TopProductsChart';
import TopCustomersChart from './TopCustomersChart';
import Loading from '../../components/LoadingPage';

function Dashboard() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [startDate, setStartDate] = useState(new Date(new Date().setHours(0,0,0,0))); // Start of today
  const [endDate, setEndDate] = useState(new Date());
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    revenueChange: 0,
    ordersChange: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await statisticsService.getDashboardStats(startDate, endDate);

      if (response.status === 200) {
        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalOrders: response.data.totalOrders || 0,
          totalRevenue: response.data.totalRevenue || 0,
          pendingOrders: response.data.pendingOrders || 0,
          revenueChange: response.data.revenueChange || 0,
          ordersChange: response.data.ordersChange || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  function formatCurrencyShortVND(amount) {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + ' tỷ đ';
    } else if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + ' triệu đ';
    } else {
      return amount.toLocaleString('vi-VN') + ' đ';
    }
  }

  const statCardsData = [
    {
      title: t('dashboard.totalUsers'),
      value: stats.totalUsers.toLocaleString(),
      icon: 'users',
      iconColor: '#8884d8',
      iconBgColor: '#f0f0ff',
      change: { value: '0%', type: 'up', period: t('dashboard.fromYesterday') }
    },
    {
      title: t('dashboard.totalOrders'),
      value: stats.totalOrders.toLocaleString(),
      icon: 'box',
      iconColor: '#ffa726',
      iconBgColor: '#fff8e1',
      change: {
        value: `${stats.ordersChange || 0}%`,
        type: stats.ordersChange >= 0 ? 'up' : 'down',
        period: t('dashboard.fromPastWeek')
      }
    },
    {
      title: t('dashboard.totalSales'),
      // value: (stats.totalRevenue || 0).toLocaleString('vi-VN', {
      //   style: 'currency',
      //   currency: 'VND',
      //   minimumFractionDigits: 0,
      //   maximumFractionDigits: 0
      // }),
      value: formatCurrencyShortVND(stats.totalRevenue || 0),
      icon: 'chart-line',
      iconColor: '#4caf50',
      iconBgColor: '#e8f5e9',
      change: {
        value: `${stats.revenueChange || 0}%`,
        type: stats.revenueChange >= 0 ? 'up' : 'down',
        period: t('dashboard.fromYesterday')
      }
    },
    {
      title: t('dashboard.totalPending'),
      value: stats.pendingOrders.toLocaleString(),
      icon: 'clock',
      iconColor: '#ff5722',
      iconBgColor: '#fbe9e7',
      change: { value: '0%', type: 'up', period: t('dashboard.fromYesterday') }
    }
  ];

  const handleDateRangeChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end || start);
  };

  if (loading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`dashboard-content ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="dashboard-header">
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <div className="date-range-picker">
            <div className="date-picker-wrapper">
              <label>{t('dashboard.startDate')}</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
                maxDate={endDate}
              />
            </div>
            <div className="date-picker-wrapper">
              <label>{t('dashboard.endDate')}</label>  
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy" 
                className="date-picker"
                minDate={startDate}
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>

        <div className="stat-cards">
          {statCardsData.map((card, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                <h3>{card.title}</h3>
                <div className="stat-icon" style={{ backgroundColor: card.iconBgColor }}>
                  <i className={`fas fa-${card.icon}`} style={{ color: card.iconColor }}></i>
                </div>
              </div>
              <div className="stat-value">{card.value}</div>
            </div>
          ))}
        </div>

        <div className="sales-chart">
          <SalesDetailsChart dateRange={{ startDate, endDate }} />
        </div>

        <div className="section-header" style={{ marginTop: '150px' }}>
          <TopProductsChart dateRange={{ startDate, endDate }} />
        </div>

        <div>
          <TopCustomersChart dateRange={{ startDate, endDate }} />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;