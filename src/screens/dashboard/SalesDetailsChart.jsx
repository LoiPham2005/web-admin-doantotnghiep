import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import { statisticsService } from '../../services/StatisticsService';
import "react-datepicker/dist/react-datepicker.css";
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

const SalesDetailsChart = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
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
        // Tạo mảng tất cả các ngày trong khoảng
        const allDates = [];
        const currentDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        while (currentDate <= endDate) {
          allDates.push({
            date: new Date(currentDate).toISOString().split('T')[0],
            totalRevenue: 0
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Map dữ liệu từ response vào mảng ngày
        const revenueByDate = {};
        response.data.forEach(item => {
          revenueByDate[item.date] = item.totalRevenue;
        });

        // Cập nhật doanh thu cho các ngày có data
        const formattedData = allDates.map(item => ({
          date: new Date(item.date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit'
          }),
          totalRevenue: revenueByDate[item.date] || 0
        }));

        // Tạo các mốc thời gian cho trục X
        const xAxisLabels = [];
        const numPoints = 10; // Số điểm muốn hiển thị trên trục X
        const step = Math.floor(formattedData.length / numPoints);

        for (let i = 0; i < formattedData.length; i += step) {
          xAxisLabels.push(formattedData[i].date);
        }
        // Đảm bảo hiển thị ngày cuối cùng
        if (xAxisLabels[xAxisLabels.length - 1] !== formattedData[formattedData.length - 1].date) {
          xAxisLabels.push(formattedData[formattedData.length - 1].date);
        }

        setChartData({
          labels: formattedData.map(item => item.date),
          values: formattedData.map(item => item.totalRevenue),
          xAxisLabels: xAxisLabels
        });
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(context.parsed.y);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          callback: function (value, index) {
            // Chỉ hiển thị các mốc đã được chọn
            return chartData.xAxisLabels.includes(this.getLabelForValue(value))
              ? this.getLabelForValue(value)
              : '';
          },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          callback: function (value) {
            if (value >= 1000000000) {
              return (value / 1000000000).toFixed(1) + ' tỷ';
            } else if (value >= 1000000) {
              return (value / 1000000).toFixed(0) + ' triệu';
            }
            return value.toLocaleString('vi-VN') + ' đ';
          }
        }
      }
    }
  };

  // Component JSX
  return (
    <div className="sales-chart-container">
      <h2>{t('statistics.salesChart.title')}</h2>
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
        <span>đến</span>
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