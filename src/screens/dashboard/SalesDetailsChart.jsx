import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
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

const SalesDetailsChart = ({ dateRange, data }) => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState({
    labels: [],
    values: []
  });
  // Thêm state loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      // Set loading khi bắt đầu format data
      setLoading(true);
      try {
        formatChartData();
      } catch (error) {
        console.error('Error formatting chart data:', error);
      } finally {
        // Set loading false sau khi hoàn thành
        setLoading(false);
      }
    }
  }, [data, dateRange]);

  const formatChartData = () => {
    // Chuyển đổi UTC về múi giờ Việt Nam (+7 GMT)
    const convertUTCToVN = (utcDate) => {
      const date = new Date(utcDate);
      // Chuyển về múi giờ Việt Nam (+7 giờ)
      const vnTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
      return vnTime.toISOString().split('T')[0]; // Trả về format YYYY-MM-DD
    };

    // Tạo danh sách tất cả các ngày trong khoảng thời gian
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const vnDateStr = convertUTCToVN(currentDate);
      dates.push(vnDateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Map dữ liệu với các ngày đã tạo
    const chartData = dates.map(dateStr => {
      // Tìm dữ liệu tương ứng với ngày này
      const dataPoint = data.find(item => item.date === dateStr);

      // Format ngày để hiển thị (dd/mm/yyyy)
      const displayDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN');

      return {
        date: displayDate,
        value: dataPoint ? dataPoint.totalRevenue : 0
      };
    });

    setChartData({
      labels: chartData.map(item => item.date),
      values: chartData.map(item => item.value)
    });
  };

  // Cập nhật options để hiển thị label tốt hơn
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
        intersect: false,
        callbacks: {
          label: function (context) {
            let label = 'Doanh thu: ';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false, // Hiển thị tất cả các label
          maxTicksLimit: 31 // Giới hạn số label tối đa
        },
        grid: {
          display: false
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
        },
        grid: {
          color: '#E2E8F0'
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