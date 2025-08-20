import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { statisticsService } from '../../services/StatisticsService';
import './SalesDetailsChart.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const SalesDetailsChart = ({ dateRange }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    values: []
  });

  useEffect(() => {
    fetchChartData();
  }, [dateRange]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await statisticsService.getRevenueByDateRange(
        dateRange.startDate,
        dateRange.endDate
      );

      if (response.status === 200 && response.data) {
        // Giới hạn số điểm dữ liệu hiển thị
        const MAX_DATA_POINTS = 50;
        const data = response.data;
        const dataPoints = data.length;

        // Nếu có quá nhiều điểm dữ liệu, lấy mẫu để giảm số lượng
        if (dataPoints > MAX_DATA_POINTS) {
          const step = Math.ceil(dataPoints / MAX_DATA_POINTS);
          const sampledData = data.filter((_, index) => index % step === 0);
          setChartData({
            labels: sampledData.map(item => new Date(item.date).toLocaleDateString('vi-VN')),
            values: sampledData.map(item => item.totalRevenue),
            xAxisLabels: sampledData.map(item => new Date(item.date).toLocaleDateString('vi-VN'))
          });
        } else {
          setChartData({
            labels: data.map(item => new Date(item.date).toLocaleDateString('vi-VN')),
            values: data.map(item => item.totalRevenue),
            xAxisLabels: data.map(item => new Date(item.date).toLocaleDateString('vi-VN'))
          });
        }
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Thêm cleanup function trong useEffect
  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        await fetchChartData();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    if (isSubscribed) {
      fetchData();
    }

    return () => {
      isSubscribed = false;
    };
  }, [dateRange]);

  // Tối ưu options
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            if (value >= 1000000000) {
              return (value / 1000000000).toFixed(1) + ' tỷ';
            }
            if (value >= 1000000) {
              return (value / 1000000).toFixed(0) + ' tr';
            }
            return value.toLocaleString('vi-VN');
          }
        }
      }
    }
  }), []);

  // Component JSX
  return (
    <div className="sales-chart-container">
      <h2 style={{ fontSize: 25, fontWeight: 'bold', marginBottom: 10 }}>{t('statistics.salesChart.title')}</h2>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="chart-container">
          <Line
            data={{
              labels: chartData.labels,
              datasets: [{
                label: 'Doanh thu',
                data: chartData.values,
                fill: true,
                borderColor: '#4285f4',
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#4285f4',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#4285f4',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
              }]
            }}
            options={options}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default SalesDetailsChart;