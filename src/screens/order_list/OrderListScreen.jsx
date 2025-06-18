import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { orderListService } from '../../services/OrderListService';
import './OrderListScreen.css';

function OrderListScreen() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderListService.getOrders();
      if (response.status === 200) {
        // Map through orders to format data
        const formattedOrders = response.data.orders.map(order => ({
          _id: order._id,
          username: order.user_id?.username || 'N/A',
          email: order.user_id?.email || 'N/A',
          total_price: order.total_price,
          shipping_fee: order.shipping_fee,
          discount: order.discount,
          final_total: order.final_total,
          payment_method: order.payment_method,
          status: order.status,
          address: order.address_id?.receiving_address || 'N/A',
          created_at: new Date(order.createdAt).toLocaleDateString('vi-VN')
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus, userId) => {
    if (window.confirm(t('orderList.confirmStatusChange'))) {
      try {
        // Gọi API cập nhật trạng thái
        const response = await orderListService.updateOrderStatus(orderId, {
          status: newStatus
        });

        if (response.status === 200) {
          alert(t('orderList.statusUpdateSuccess'));
          fetchOrders(); // Refresh order list
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        alert(error?.response?.data?.message || t('common.error'));
      }
    }
  };

  // Helper functions để lấy tiêu đề và nội dung thông báo
  const getNotificationTitle = (status) => {
    switch (status) {
      case 'confirmed': return 'Đơn hàng được xác nhận';
      case 'shipping': return 'Đơn hàng đang giao';
      case 'delivered': return 'Đơn hàng đã giao';
      case 'cancelled': return 'Đơn hàng đã hủy';
      case 'return_approved': return 'Yêu cầu trả hàng được chấp nhận';
      case 'return_rejected': return 'Yêu cầu trả hàng bị từ chối';
      case 'returned': return 'Đơn hàng đã hoàn trả';
      default: return 'Cập nhật trạng thái đơn hàng';
    }
  };

  const getNotificationMessage = (status, orderId) => {
    const orderCode = orderId.slice(-6);
    switch (status) {
      case 'confirmed': return `Đơn hàng #${orderCode} đã được xác nhận`;
      case 'shipping': return `Đơn hàng #${orderCode} đang được giao`;
      case 'delivered': return `Đơn hàng #${orderCode} đã giao thành công`;
      case 'cancelled': return `Đơn hàng #${orderCode} đã bị hủy`;
      case 'return_approved': return `Yêu cầu trả hàng cho đơn #${orderCode} đã được chấp nhận`;
      case 'return_rejected': return `Yêu cầu trả hàng cho đơn #${orderCode} đã bị từ chối`;
      case 'returned': return `Đơn hàng #${orderCode} đã hoàn trả thành công`;
      default: return `Đơn hàng #${orderCode} đã được cập nhật trạng thái mới`;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'confirmed': return '#2196F3';
      case 'shipping': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      case 'return_requested': return '#FF9800';
      case 'return_approved': return '#00BCD4';
      case 'return_rejected': return '#FF5722';
      case 'returned': return '#795548';
      case 'reviewed': return '#009688'; // Add this line
      default: return '#000000';
    }
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  return (
    <MainLayout>
      <div className="order-list-container">
        <div className="page-header">
          <h1>{t('orderList.title')}</h1>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">{t('orderList.allOrders')}</option>
            <option value="pending">{t('orderList.status.pending')}</option>
            <option value="confirmed">{t('orderList.status.confirmed')}</option>
            <option value="shipping">{t('orderList.status.shipping')}</option>
            <option value="delivered">{t('orderList.status.delivered')}</option>
            <option value="cancelled">{t('orderList.status.cancelled')}</option>
            <option value="return_requested">{t('orderList.status.return_requested')}</option>
            <option value="return_approved">{t('orderList.status.return_accepted')}</option>
            <option value="return_rejected">{t('orderList.status.return_rejected')}</option>
            <option value="returned">{t('orderList.status.returned')}</option>
            <option value="reviewed">{t('orderList.status.reviewed')}</option> {/* Add this line */}
          </select>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>{t('orderList.orderId')}</th>
              <th>{t('orderList.customer')}</th>
              <th>{t('orderList.totalAmount')}</th>
              <th>{t('orderList.shippingFee')}</th>
              <th>{t('orderList.discount')}</th>
              <th>{t('orderList.finalTotal')}</th>
              <th>{t('orderList.paymentMethod')}</th>
              <th>{t('orderList.shippingAddress')}</th>
              <th>{t('orderList.orderDate')}</th>
              <th>{t('orderList.orderStatus')}</th>
              <th>{t('orderList.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>
                  <div>{order.username}</div>
                  <div className="email">{order.email}</div>
                </td>
                <td>{order.total_price.toLocaleString('vi-VN')}đ</td>
                <td>{order.shipping_fee.toLocaleString('vi-VN')}đ</td>
                <td>{order.discount.toLocaleString('vi-VN')}đ</td>
                <td>{order.final_total.toLocaleString('vi-VN')}đ</td>
                <td>{order.payment_method}</td>
                <td>{order.address}</td>
                <td>{order.created_at}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusBadgeColor(order.status) }}
                  >
                    {t(`orderList.status.${order.status}`)}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value, order.user_id?._id)}
                    className="status-select"
                  >
                    <option value="pending">{t('orderList.status.pending')}</option>
                    <option value="confirmed">{t('orderList.status.confirmed')}</option>
                    <option value="processing">{t('orderList.status.processing')}</option>
                    <option value="shipping">{t('orderList.status.shipping')}</option>
                    <option value="delivered">{t('orderList.status.delivered')}</option>
                    <option value="received">{t('orderList.status.received')}</option>
                    <option value="cancelled">{t('orderList.status.cancelled')}</option>
                    <option value="return_requested">{t('orderList.status.return_requested')}</option>
                    <option value="return_accepted">{t('orderList.status.return_accepted')}</option>
                    <option value="return_rejected">{t('orderList.status.return_rejected')}</option>
                    <option value="returned">{t('orderList.status.returned')}</option>
                    <option value="refunded">{t('orderList.status.refunded')}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default OrderListScreen;