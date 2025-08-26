import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import { orderListService } from '../../services/OrderListService';
import './OrderListScreen.css';
import Modal from './modal/Modal';

function OrderListScreen() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Add search states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Thêm states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Thêm state mới
  const [selectedReturnRequest, setSelectedReturnRequest] = useState(null);
  const [showReturnRequestModal, setShowReturnRequestModal] = useState(false);

  // Thêm state mới
  const [selectedCancelRequest, setSelectedCancelRequest] = useState(null);
  const [showCancelRequestModal, setShowCancelRequestModal] = useState(false);

  // Thêm state mới cho modal hủy đơn
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Thêm log để debug
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderListService.getOrders();
      console.log('Orders response:', response.data); // Debug log
      if (response.status === 200) {
        setOrders(response.data.orders);
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
      case 'processing': return '#2196F3';
      case 'shipping': return '#9C27B0';
      case 'delivered': return '#4CAF50';
      case 'cancelled': return '#F44336';
      // case 'return_requested': return '#FF9800';
      // case 'return_approved': return '#00BCD4';
      // case 'return_rejected': return '#FF5722';
      case 'returned': return '#795548';
      // case 'reviewed': return '#009688'; 
      default: return '#000000';
    }
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Add search handler
  const handleSearch = async (keyword) => {
    try {
      setLoading(true);
      const response = await orderListService.searchOrders(keyword);
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
          created_at: new Date(order.created_at).toLocaleDateString('vi-VN')
        }));
        setOrders(formattedOrders);
        setCurrentPage(1); // Reset về trang 1
      }
    } catch (error) {
      console.error('Error searching orders:', error);
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
        fetchOrders();
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  // Thêm function xử lý hoàn tiền
  const handleRefund = async (order) => {
    if (!order.momo_trans_id) {
      alert('Không tìm thấy mã giao dịch MoMo');
      return;
    }

    if (window.confirm(t('orderList.confirmRefund'))) {
      try {
        const response = await orderListService.refundMomoPayment({
          orderId: order._id,
          amount: order.final_total,
          transId: order.momo_trans_id,
          description: `Hoàn tiền đơn hàng #${order._id.slice(-6)}`
        });

        if (response.status === 200) {
          alert(t('orderList.refundSuccess'));
          fetchOrders(); // Refresh danh sách
        }
      } catch (error) {
        console.error('Error refunding payment:', error);
        const errorMessage = error.response?.data?.message || t('common.error');
        alert(errorMessage);
      }
    }
  };

  // Sửa lại hàm handleViewDetail
  const handleViewDetail = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderListService.getOrderDetail(orderId);
      console.log("Order detail response:", response); // Debug log

      if (response.status === 200) {
        setSelectedOrder(response.data); // Remove .data here
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Error fetching order detail:', error);
      alert(error?.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Sửa lại OrderDetailModal component
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <Modal
        isOpen={showDetailModal}
        onClose={onClose}
        title={t('orderList.orderDetail.title')}
        size="lg"
      >
        <div className="order-detail">
          <div className="order-info">
            <h3>{t('orderList.orderDetail.orderInfo')}</h3>
            <p><strong>{t('orderList.orderId')}:</strong> {order.order._id}</p>
            <p><strong>{t('orderList.orderDate')}:</strong> {new Date(order.order.createdAt).toLocaleDateString('vi-VN')}</p>
            <p><strong>{t('orderList.status.title')}:</strong> {t(`orderList.status.${order.order.status}`)}</p>
            <p><strong>{t('orderList.paymentMethod')}:</strong> {order.order.payment_method}</p>
          </div>

          <div className="customer-info">
            <h3>{t('orderList.orderDetail.customerInfo')}</h3>
            <p><strong>{t('orderList.customer')}:</strong> {order.order.user.username}</p>
            <p><strong>{t('orderList.email')}:</strong> {order.order.user.email}</p>
            <p><strong>{t('orderList.shippingAddress')}:</strong> {`${order.order.full_name}, ${order.order.receiving_address}, ${order.order.commune}, ${order.order.district}, ${order.order.province}`}</p>
          </div>

          <div className="products-info">
            <h3>{t('orderList.orderDetail.products')}</h3>
            <table className="detail-table">
              <thead>
                <tr>
                  <th>{t('orderList.orderDetail.productName')}</th>
                  <th>{t('orderList.orderDetail.variant')}</th>
                  <th>{t('orderList.orderDetail.quantity')}</th>
                  <th>{t('orderList.orderDetail.price')}</th>
                  <th>{t('orderList.orderDetail.subtotal')}</th>
                </tr>
              </thead>
              <tbody>
                {order.orderDetails?.map((detail, index) => (
                  <tr key={index}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={detail.image}
                          alt={detail.productName}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        {detail.productName}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: detail.color.hex,
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                          }}
                        />
                        {detail.color.name} - {detail.size}
                      </div>
                    </td>
                    <td>{detail.quantity}</td>
                    <td>{detail.price?.toLocaleString('vi-VN')}đ</td>
                    <td>{(detail.quantity * detail.price)?.toLocaleString('vi-VN')}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="order-summary">
            <h3>{t('orderList.orderDetail.summary')}</h3>
            <p><strong>{t('orderList.totalAmount')}:</strong> {order.order.total_price?.toLocaleString('vi-VN')}đ</p>
            <p><strong>{t('orderList.shippingFee')}:</strong> {order.order.shipping_fee?.toLocaleString('vi-VN')}đ</p>
            <p><strong>{t('orderList.discount')}:</strong> {order.order.discount?.toLocaleString('vi-VN')}đ</p>
            <p className="final-total"><strong>{t('orderList.finalTotal')}:</strong> {order.order.final_total?.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
      </Modal>
    );
  };

  // Thêm hàm xử lý yêu cầu trả hàng
  const handleViewReturnRequest = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderListService.getReturnRequest(orderId);
      if (response.status === 200) {
        setSelectedReturnRequest(response.data);
        setShowReturnRequestModal(true);

      }
    } catch (error) {
      console.error('Error fetching return request:', error);
      alert(error?.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  // Sửa lại hàm xử lý chấp nhận/từ chối trả hàng
  const handleReturnRequestAction = async (requestId, status) => {
    try {
      const response = await orderListService.updateReturnRequestStatus(requestId, { status });

      if (response.status === 200) {
        alert(t('orderList.returnRequest.updateSuccess'));
        setShowReturnRequestModal(false);
        fetchOrders(); // Refresh danh sách đơn hàng
      }
    } catch (error) {
      console.error('Error updating return request:', error);
      alert(error?.response?.data?.message || t('common.error'));
    }
  };

  // Sửa lại modal xem chi tiết yêu cầu trả hàng
  const ReturnRequestModal = ({ request, onClose }) => {
    if (!request) return null;

    return (
      <Modal
        isOpen={showReturnRequestModal}
        onClose={onClose}
        title={t('orderList.returnRequest.title')}
        size="lg"
      >
        <div className="return-request-detail">
          <div className="request-info">
            <h3>{t('orderList.returnRequest.requestInfo')}</h3>
            <p><strong>{t('orderList.returnRequest.orderId')}:</strong> #{request.order_id.slice(-6)}</p>
            {/* <p><strong>{t('orderList.returnRequest.orderId')}:</strong> #{request.user.u}</p> */}
            <p><strong>{t('orderList.returnRequest.reason')}:</strong> {request.reason}</p>
            <p><strong>{t('orderList.returnRequest.status.title')}:</strong>
              <span className={`status-badge ${request.status}`}>
                {t(`orderList.returnRequest.status.${request.status}`)}
              </span>
            </p>
            {request.status !== 'pending' && (
              <p><strong>Thời gian xử lý:</strong> {new Date(request.updatedAt).toLocaleString()}</p>
            )}
          </div>

          {request.images && request.images.length > 0 && (
            <div className="images-section">
              <h3>{t('orderList.returnRequest.images')}</h3>
              <div className="image-grid">
                {request.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Return request ${index + 1}`}
                    className="return-image"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Chỉ hiện nút khi đang ở trạng thái chờ xử lý */}
          {request.status === 'pending' && (
            <div className="action-buttons">
              <button
                className="approve-button"
                onClick={() => handleReturnRequestAction(request._id, 'approved')}
              >
                {t('orderList.returnRequest.approve')}
              </button>
              <button
                className="reject-button"
                onClick={() => handleReturnRequestAction(request._id, 'rejected')}
              >
                {t('orderList.returnRequest.reject')}
              </button>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // Thêm hàm xử lý yêu cầu hủy đơn
  const handleViewCancelRequest = async (orderId) => {
    try {
      setLoading(true);
      const response = await orderListService.getCancelRequest(orderId);
      if (response.status === 200) {
        setSelectedCancelRequest(response.data);
        setShowCancelRequestModal(true);
      }
    } catch (error) {
      console.error('Error fetching cancel request:', error);
      if (error.response?.status === 404) {
        alert(t('orderList.cancelRequest.noRequestFound'));
      } else {
        alert(error?.response?.data?.message || t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý phê duyệt/từ chối hủy đơn
  const handleCancelRequestAction = async (requestId, status) => {
    try {
      const response = await orderListService.updateCancelRequestStatus(requestId, { status });
      if (response.status === 200) {
        alert(t('orderList.cancelRequest.updateSuccess'));
        setShowCancelRequestModal(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating cancel request:', error);
      alert(error?.response?.data?.message || t('common.error'));
    }
  };

  // Thêm component modal xem chi tiết yêu cầu hủy đơn
  const CancelRequestModal = ({ request, onClose }) => {
    if (!request) return null;

    // Debug log để kiểm tra dữ liệu  
    console.log('Cancel request data:', request);

    return (
      <Modal
        isOpen={showCancelRequestModal}
        onClose={onClose}
        title={t('orderList.cancelRequest.title')}
        size="lg"
      >
        <div className="cancel-request-detail">
          <div className="request-info">
            <h3>{t('orderList.cancelRequest.requestInfo')}</h3>
            <p><strong>{t('orderList.orderId')}:</strong> #{request.order_id}</p>
            {/* <p>
              <strong>{t('orderList.cancelRequest.customer')}:</strong>
              {request.user && request.user.username} 
            </p>
            <p>
              <strong>{t('orderList.cancelRequest.email')}:</strong>
              {request.user && request.user.email} 
            </p> */}
            <p><strong>{t('orderList.cancelRequest.reason')}:</strong> {request.reason}</p>
            {/* <p>
              <strong>{t('orderList.cancelRequest.status.title')}:</strong>
              <span className={`status-badge ${request.status}`}>
                {t(`orderList.cancelRequest.status.${request.status}`)}
              </span>
            </p> */}
            {request.status !== 'pending' && (
              <p><strong>Thời gian xử lý:</strong> {new Date(request.updatedAt).toLocaleString()}</p>
            )}
          </div>

          {request.images && request.images.length > 0 && (
            <div className="images-section">
              <h3>{t('orderList.cancelRequest.images')}</h3>
              <div className="image-grid">
                {request.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Cancel request image ${index + 1}`}
                    className="cancel-image"
                  />
                ))}
              </div>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="action-buttons">
              <button
                className="approve-button"
                onClick={() => handleCancelRequestAction(request._id, 'approved')}
              >
                {t('orderList.cancelRequest.approve')}
              </button>
              <button
                className="reject-button"
                onClick={() => handleCancelRequestAction(request._id, 'rejected')}
              >
                {t('orderList.cancelRequest.reject')}
              </button>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // Thêm hàm xử lý hiển thị modal hủy đơn
  const handleShowCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
    setCancelReason('');
  };

  // Thêm hàm xử lý hủy đơn
  const handleCancelOrder = async () => {
    try {
      if (!cancelReason.trim()) {
        alert('Vui lòng nhập lý do hủy đơn');
        return;
      }

      console.log("Submitting cancel request:", {
        order_id: selectedOrderId,
        user_id: 'admin',
        reason: cancelReason,
        is_admin_cancel: true
      });

      const response = await orderListService.createCancelRequest({
        order_id: selectedOrderId,
        user_id: 'admin',
        reason: cancelReason,
        is_admin_cancel: true
      });

      if (response.status === 200) {
        alert(t('orderList.cancelSuccess'));
        setShowCancelModal(false);
        setCancelReason('');
        fetchOrders(); // Refresh danh sách đơn hàng
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert(error?.response?.data?.message || t('common.error'));
    }
  };

  const renderActionButtons = (order) => {
    return (
      <div className="action-buttons">
        <button
          className="view-button"
          onClick={() => handleViewDetail(order._id)}
          title={t('orderList.viewDetail')}
        >
          <i className="fas fa-eye"></i>
        </button>

        {/* Thêm nút hủy đơn cho trạng thái pending và processing */}
        {['pending', 'processing'].includes(order.status) && (
          <button
            className="cancel-button"
            onClick={() => handleShowCancelModal(order._id)}
            title={t('orderList.cancelOrder')}
          >
            <i className="fas fa-times"></i>
          </button>
        )}

        {/* Thêm nút xem lý do hủy khi đơn đã hủy */}
        {order.status === 'cancelled' && (
          <button
            className="cancel-reason-button"
            onClick={() => handleViewCancelRequest(order._id)}
            title={t('orderList.cancelRequest.viewReason')}
          >
            <i className="fas fa-ban"></i>
          </button>
        )}

        {/* Hiển thị nút xem yêu cầu trả với đơn đã giao có yêu cầu trả pending */}
        {order.status === 'delivered' && order.has_return_request && (
          <button
            className="return-request-button"
            onClick={() => handleViewReturnRequest(order._id)}
            title={t('orderList.returnRequest.viewRequest')}
          >
            <i className="fas fa-undo"></i>
          </button>
        )}

        {/* Hiển thị nút xem lý do trả với đơn đã trả hoặc đã từ chối trả */}
        {(order.status === 'returned' ||
          (order.status === 'delivered'
            // && order.has_return_request !== null
          )) && (
            <button
              className="return-reason-button"
              onClick={() => handleViewReturnRequest(order._id)}
              title={t('orderList.returnRequest.viewReason')}
            >
              <i className="fas fa-info-circle"></i>
            </button>
          )}

        <select
          value={order.status}
          onChange={(e) => handleStatusChange(order._id, e.target.value)}
          className="status-select"
          disabled={order.status === 'delivered' || order.status === 'returned' || order.status === 'cancelled'}
        >
          <option value="pending">{t('orderList.status.pending')}</option>
          <option value="processing">{t('orderList.status.processing')}</option>
          <option value="shipping">{t('orderList.status.shipping')}</option>
          <option value="delivered">{t('orderList.status.delivered')}</option>
          <option value="returned">{t('orderList.status.returned')}</option>
          <option value="cancelled">{t('orderList.status.cancelled')}</option>
        </select>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="order-list-container">
        <div className="page-header">
          <h1>{t('orderList.title')}</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder={t('orderList.searchPlaceholder')}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
          </div>
        </div>

        <div className="status-filter-container">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1); // Reset về trang 1 khi lọc
            }}
            className="status-filter"
          >
            {/* <option value="all">{t('orderList.allOrders')}</option>
            <option value="pending">{t('orderList.status.pending')}</option>
            <option value="confirmed">{t('orderList.status.confirmed')}</option>
            <option value="shipping">{t('orderList.status.shipping')}</option>
            <option value="delivered">{t('orderList.status.delivered')}</option>
            <option value="cancelled">{t('orderList.status.cancelled')}</option>
            <option value="return_requested">{t('orderList.status.return_requested')}</option>
            <option value="return_approved">{t('orderList.status.return_accepted')}</option>
            <option value="return_rejected">{t('orderList.status.return_rejected')}</option>
            <option value="returned">{t('orderList.status.returned')}</option>
            <option value="reviewed">{t('orderList.status.reviewed')}</option> */}

            <option value="all">{t('orderList.allOrders')}</option>
            <option value="pending">{t('orderList.status.pending')}</option>
            <option value="processing">{t('orderList.status.processing')}</option>
            <option value="shipping">{t('orderList.status.shipping')}</option>
            <option value="delivered">{t('orderList.status.delivered')}</option>
            <option value="returned">{t('orderList.status.returned')}</option>
            <option value="cancelled">{t('orderList.status.cancelled')}</option>

          </select>
        </div>

        <table className="orders-table">
          <thead>
            <tr>
              <th>STT</th>  {/* Thêm cột STT */}
              <th>{t('orderList.orderId')}</th>
              <th>{t('orderList.customer')}</th>
              <th>{t('orderList.totalAmount')}</th>
              {/* <th>{t('orderList.shippingFee')}</th> */}
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
            {paginatedOrders.map((order, index) => (
              <tr key={order._id}>
                <td>{(currentPage - 1) * pageSize + index + 1}</td>  {/* STT */}
                <td>{order._id.slice(-6)}</td>
                <td>
                  <div>{order.username}</div>
                  <div className="email">{order.email}</div>
                </td>
                <td>{order.total_price.toLocaleString('vi-VN')}đ</td>
                {/* <td>{order.shipping_fee.toLocaleString('vi-VN')}đ</td> */}
                <td>{order.discount.toLocaleString('vi-VN')}đ</td>
                <td>{order.final_total.toLocaleString('vi-VN')}đ</td>
                <td>{order.payment_method}</td>
                <td>{order.address}</td>
                <td>{order.created_at}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusBadgeColor(order.status), color: 'white' }}
                  >
                    {t(`orderList.status.${order.status}`)}
                  </span>
                </td>
                <td>
                  {renderActionButtons(order)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? 'active' : ''}
              >
                {page}
              </button>
            ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}

        {/* Add Modal component */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedOrder(null);
            }}
          />
        )}

        {/* Thêm modal yêu cầu trả hàng */}
        {selectedReturnRequest && (
          <ReturnRequestModal
            request={selectedReturnRequest}
            onClose={() => {
              setShowReturnRequestModal(false);
              setSelectedReturnRequest(null);
            }}
          />
        )}

        {/* Thêm modal yêu cầu hủy đơn */}
        {selectedCancelRequest && (
          <CancelRequestModal
            request={selectedCancelRequest}
            onClose={() => {
              setShowCancelRequestModal(false);
              setSelectedCancelRequest(null);
            }}
          />
        )}

        {/* Thêm Modal hủy đơn */}
        {showCancelModal && (
          <Modal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            title={t('orderList.cancelOrder')}
            size="md"
          >
            <div className="cancel-order-modal">
              <div className="form-group">
                {/* <label>{t('orderList.cancelRequest.reason')}</label> */}
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder={t('orderList.cancelRequest.reasonPlaceholder')}
                  rows={4}
                  className="form-control"
                />
              </div>
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  {t('common.cancel')}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleCancelOrder}
                >
                  {t('orderList.cancelOrder')}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </MainLayout>
  );
}

export default OrderListScreen;