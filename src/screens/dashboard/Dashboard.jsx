import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import SalesDetailsChart from './SalesDetailsChart';
import { statisticsService } from '../../services/StatisticsService';
import { useTheme } from '../../contexts/ThemeContext';
import './Dashboard.css';
import Sidebar from '../../components/Sidebar';
import TopProductsChart from './TopProductsChart';
import TopCustomersChart from './TopCustomersChart';

function Dashboard() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
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
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await statisticsService.getDashboardStats();

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
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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
      value: (stats.totalRevenue || 0).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
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

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={`dashboard-content ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="dashboard-header">
          <h1 className="page-title">{t('dashboard.title')}</h1>
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
              {/* <div className={`stat-change ${card.change.type}`}>
                <i className={`fas fa-arrow-${card.change.type}`}></i>
                <span>{card.change.value} {card.change.period}</span>
              </div> */}
            </div>
          ))}
        </div>

        {/* <div className="chart-section"> */}
        {/* <div className="section-header"> */}
        {/* <h2>{t('dashboard.charts.salesDetails')}</h2> */}
        {/* <div className="period-selector">
              <span>{t('dashboard.period.october')}</span>
              <i className="fas fa-chevron-down"></i>
            </div> */}
        {/* </div> */}
        <div className="sales-chart">
          <SalesDetailsChart />
        </div>
        {/* </div> */}

        {/* <div className="chart-section" style={{ marginTop: '200px' }}> */}
        <div className="section-header" style={{ marginTop: '150px' }}>
          {/* <h2>{t('dashboard.charts.topProducts')}</h2> */}
          <TopProductsChart />
        </div>

        {/* </div> */}

        <div >
          <TopCustomersChart />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;