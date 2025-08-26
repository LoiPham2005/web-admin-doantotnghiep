import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { voucherService } from '../../services/VoucherService';
import AuthService from '../../services/AuthService';
import './VoucherScreen.css';
import { userService } from '../../services/UserService';
import { userVoucherService } from '../../services/UserVoucherService';
import Loading from '../../components/LoadingPage'; // Import component Loading

function VoucherScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [voucherType, setVoucherType] = useState('all'); // 'all' hoặc 'specific'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'order',           // Thêm type
    discount_type: 'percentage', // Sửa tên field
    discount_value: '', // Sửa tên field
    start_date: '', // Sửa tên field
    end_date: '', // Sửa tên field
    quantity: '',
    minimum_order_value: '', // Sửa tên field
    maximum_discount: '' // Sửa tên field
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Thêm state để theo dõi loại voucher được chọn
  const [selectedType, setSelectedType] = useState(formData.type || 'order');

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Sửa lại useEffect fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getAllUsers();
        console.log('Fetched users:', response); // Debug log
        if (response) {
          // Lọc chỉ lấy những user có role là 'user'
          const filteredUsers = response.filter(user => user.role === 'user');
          setUsers(filteredUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      const response = await voucherService.getVouchers();
      if (response?.status === 200) {
        setVouchers(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;

  //   // Khi thay đổi type voucher
  //   if (name === 'type') {
  //     setSelectedType(value);
  //     // Nếu chọn shipping, tự động set discount_type thành fixed
  //     if (value === 'shipping') {
  //       setFormData(prev => ({
  //         ...prev,
  //         [name]: value,
  //         discount_type: 'fixed'
  //       }));
  //     } else {
  //       setFormData(prev => ({
  //         ...prev,
  //         [name]: value
  //       }));
  //     }
  //   } else {
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }
  // };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Khi thay đổi type voucher
    if (name === 'type') {
      setSelectedType(value);
      // Nếu chọn shipping, tự động set discount_type thành fixed
      if (value === 'shipping') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          discount_type: 'fixed'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
      return; // Dừng ở đây, không tiếp tục các xử lý khác
    }

    // Xử lý các input khác
    if (name === 'discount_type') {
      // Khi thay đổi loại giảm giá
      if (value === 'fixed') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          maximum_discount: prev.discount_value || 0
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else if (name === 'discount_value' && formData.discount_type === 'fixed') {
      // Khi thay đổi giá trị giảm với loại fixed, tự động cập nhật maximum_discount
      setFormData(prev => ({
        ...prev,
        [name]: value,
        maximum_discount: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      type: 'order',
      discount_type: 'percentage',
      discount_value: '',
      start_date: '',
      end_date: '',
      quantity: '',
      minimum_order_value: '',
      maximum_discount: ''
    });
    setEditingVoucher(null);
    setSelectedUsers([]);
    setVoucherType('all');
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user._id !== userId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setIsLoading(true);

    try {
      const voucherData = {
        ...formData,
        discount_value: Number(formData.discount_value),
        minimum_order_value: Number(formData.minimum_order_value),
        maximum_discount: Number(formData.maximum_discount),
        quantity: Number(formData.quantity)
      };

      let response;
      if (editingVoucher) {
        response = await voucherService.updateVoucher(editingVoucher._id, voucherData);
        // if (response.status === 200) {
        //   // Handle user vouchers
        //   await userVoucherService.removeAllUserVouchers(editingVoucher._id);

        //   if (voucherType === 'all') {
        //     const allUsers = await userService.getAllUsers();
        //     await Promise.all(allUsers.map(user =>
        //       userVoucherService.saveVoucherToUser({
        //         user_id: user._id,
        //         voucher_id: editingVoucher._id
        //       })
        //     ));
        //   } else if (voucherType === 'specific' && selectedUsers.length > 0) {
        //     await Promise.all(selectedUsers.map(user =>
        //       userVoucherService.saveVoucherToUser({
        //         user_id: user._id,
        //         voucher_id: editingVoucher._id
        //       })
        //     ));
        //   }
        // }
      } else {
        // Adding a new voucher
        response = await voucherService.addVoucher(voucherData);
        // if (response.status === 200) {
        //   const voucherId = response.data._id || response.data.data._id;

        //   if (voucherType === 'all') {
        //     // Fetch all users and add the voucher to each
        //     const allUsers = await userService.getAllUsers();
        //     await Promise.all(allUsers.map(user =>
        //       userVoucherService.saveVoucherToUser({
        //         user_id: user._id,
        //         voucher_id: voucherId
        //       })
        //     ));
        //   } else if (voucherType === 'specific' && selectedUsers.length > 0) {
        //     await Promise.all(selectedUsers.map(user =>
        //       userVoucherService.saveVoucherToUser({
        //         user_id: user._id,
        //         voucher_id: voucherId
        //       })
        //     ));
        //   }
        // }
      }

      // alert(t(editingVoucher ? 'vouchers.messages.updateSuccess' : 'vouchers.messages.addSuccess'));
      // resetForm();
      // fetchVouchers();

      if (response.status === 200) {
        alert(t(editingVoucher ? 'vouchers.messages.updateSuccess' : 'vouchers.messages.addSuccess'));
        resetForm();
        fetchVouchers();
      }

    } catch (error) {
      console.error('Submit error:', error);
      alert(error?.response?.data?.message || t('common.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (voucher) => {
    try {
      setEditingVoucher(voucher);

      // Fetch users associated with the voucher
      const response = await userVoucherService.getUsersByVoucherId(voucher._id);

      if (response.status === 200) {
        const allUsers = await userService.getAllUsers();
        const regularUsers = allUsers.filter(user => user.role === 'user');

        // If the voucher is for all users, reset selected users
        if (response.data.length === regularUsers.length) {
          setVoucherType('all');
          setSelectedUsers([]); // Reset selected users
        } else {
          setVoucherType('specific');
          const users = response.data.map(uv => uv.user_id);
          setSelectedUsers(users);
        }
      }

      // Set form data with the voucher details
      setFormData({
        name: voucher.name || '',
        code: voucher.code || '',
        type: voucher.type || 'order',
        discount_type: voucher.discount_type || 'percentage',
        discount_value: voucher.discount_value || '',
        minimum_order_value: voucher.minimum_order_value || '',
        maximum_discount: voucher.maximum_discount || '',
        start_date: voucher.start_date ? new Date(voucher.start_date).toISOString().split('T')[0] : '',
        end_date: voucher.end_date ? new Date(voucher.end_date).toISOString().split('T')[0] : '',
        quantity: voucher.quantity || ''
      });

      setIsModalOpen(true);
    } catch (error) {
      console.error('Error getting voucher users:', error);
      alert(t('common.error'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('vouchers.messages.confirmDelete'))) {
      setIsLoading(true);
      try {
        const response = await voucherService.deleteVoucher(id);
        if (response.status === 200) {
          alert(t('vouchers.messages.deleteSuccess'));
          fetchVouchers();
        }
      } catch (error) {
        console.error('Error deleting voucher:', error);
        if (error.status === 401) {
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
        } else {
          alert(t('common.error'));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(vouchers.length / pageSize);
  const paginatedVouchers = vouchers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Thêm hàm xử lý search
  const handleSearch = async (keyword) => {
    try {
      setIsLoading(true);
      const result = await voucherService.searchVouchers(keyword);
      if (result.status === 200) {
        setVouchers(result.data);
        setCurrentPage(1); // Reset về trang 1 khi search
      }
    } catch (error) {
      console.error('Error searching vouchers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm debounce search
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchKeyword(value);

    // Clear timeout cũ
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set timeout mới
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        handleSearch(value);
      } else {
        fetchVouchers(); // Fetch lại toàn bộ vouchers nếu search rỗng
      }
    }, 500);

    setSearchTimeout(timeoutId);
  };

  return (
    <MainLayout>
      {isLoading && <Loading />}
      <div className="vouchers-container">
        <div className="page-header">
          <h1>{t('vouchers.title')}</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder={t('vouchers.searchPlaceholder')}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            <button className="add-button" onClick={() => setIsModalOpen(true)}>
              <i className="fas fa-plus"></i>
              {t('vouchers.addVoucher')}
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="vouchers-table">
            <thead>
              <tr>
                <th>STT</th>  {/* Thêm cột STT */}
                <th>{t('vouchers.form.name')}</th>
                <th>{t('vouchers.form.code')}</th>
                <th>{t('vouchers.form.discountValue')}</th>
                <th>{t('vouchers.form.startDate')}</th>
                <th>{t('vouchers.form.endDate')}</th>
                <th>{t('vouchers.form.quantity')}</th>
                <th>{t('common.edit')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVouchers.map((voucher, index) => (
                <tr key={voucher._id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>  {/* STT */}
                  <td>{voucher.name}</td>
                  <td>{voucher.code}</td>
                  <td>{voucher.discount_value}{voucher.discount_type === 'percentage' ? '%' : 'đ'}</td>
                  <td>{new Date(voucher.start_date).toLocaleDateString()}</td>
                  <td>{new Date(voucher.end_date).toLocaleDateString()}</td>
                  <td>{voucher.quantity}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-button" onClick={() => handleEdit(voucher)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="delete-button" onClick={() => handleDelete(voucher._id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PHÂN TRANG */}
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
            {t('common.pagination.Next')}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {t('common.pagination.Last')}
          </button>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingVoucher ? t('vouchers.editVoucher') : t('vouchers.addVoucher')}</h2>
                <button className="close-button" onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('vouchers.form.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.code')}</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.type')}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        value="order"
                        checked={formData.type === 'order'}
                        onChange={handleInputChange}
                      />
                      {t('vouchers.form.typeOrder')}
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type"
                        value="shipping"
                        checked={formData.type === 'shipping'}
                        onChange={handleInputChange}
                      />
                      {t('vouchers.form.typeShipping')}
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.discountType')}</label>
                  {selectedType === 'shipping' ? (
                    // Nếu là shipping voucher, hiển thị text "Số tiền cố định"
                    <div className="fixed-discount-text">
                      {t('vouchers.form.fixed')}
                    </div>
                  ) : (
                    // Nếu là order voucher, cho phép chọn cả 2 loại
                    <select
                      name="discount_type"
                      value={formData.discount_type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="percentage">{t('vouchers.form.percentage')}</option>
                      <option value="fixed">{t('vouchers.form.fixed')}</option>
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.discountValue')}</label>
                  <input
                    type="number"
                    name="discount_value" // Sửa từ discountValue thành discount_value
                    value={formData.discount_value}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max={formData.discountType === 'percentage' ? "100" : undefined}
                  />
                  {formData.discountType === 'percentage' && formData.discountValue > 100 && (
                    <span className="error-message">
                      {t('vouchers.errors.invalidPercentage')}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.startDate')}</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.endDate')}</label>
                  <input
                    type="date"
                    name="end_date" // Sửa từ endDate thành end_date
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.quantity')}</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>{t('vouchers.form.minimumOrderValue')}</label>
                  <input
                    type="number"
                    name="minimum_order_value" // Sửa từ minimumOrderValue thành minimum_order_value
                    value={formData.minimum_order_value}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div>

                {/* <div className="form-group">
                  <label>{t('vouchers.form.maximumDiscount')}</label>
                  <input
                    type="number"
                    name="maximum_discount" // Sửa từ maximumDiscount thành maximum_discount
                    value={formData.maximum_discount}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </div> */}


                {/* Chỉ hiển thị trường maximum_discount khi discount_type là percentage */}
                {formData.discount_type === 'percentage' && (
                  <div className="form-group">
                    <label>{t('vouchers.form.maximumDiscount')}</label>
                    <input
                      type="number"
                      name="maximum_discount"
                      value={formData.maximum_discount}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                )}

                {/* <div className="form-group">
                  <label>{t('vouchers.form.voucherType')}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="voucherType"
                        value="all"
                        checked={voucherType === 'all'}
                        onChange={(e) => setVoucherType(e.target.value)}
                      />
                      {t('vouchers.form.allUsers')}
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="voucherType"
                        value="specific"
                        checked={voucherType === 'specific'}
                        onChange={(e) => setVoucherType(e.target.value)}
                      />
                      {t('vouchers.form.specificUsers')}
                    </label>
                  </div>
                </div> */}

                {/* {voucherType === 'specific' && (
                  <div className="form-group">
                    <label>{t('vouchers.form.selectUsers')}</label>
                    <select
                      className="user-select"
                      onChange={(e) => {
                        const selectedUser = users.find(u => u._id === e.target.value);
                        if (selectedUser && !selectedUsers.some(u => u._id === selectedUser._id)) {
                          setSelectedUsers(prev => [...prev, selectedUser]);
                        }
                      }}
                      value=""
                    >
                      <option value="">{t('vouchers.form.selectUser')}</option>
                      {users && users.length > 0 ? (
                        users.map(user => (
                          <option key={user._id} value={user._id}>
                            {user.email} - {user.username}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading users...</option>
                      )}
                    </select>

                    {selectedUsers.length > 0 && (
                      <div className="selected-users-list">
                        <h4>Người dùng đã chọn:</h4>
                        {selectedUsers.map(user => (
                          <div key={user._id} className="selected-user-item">
                            <div className="user-info">
                              <span className="email">{user.email}</span>
                              <span className="username">({user.username})</span>
                            </div>
                            <button
                              type="button"
                              className="remove-user-btn"
                              onClick={() => setSelectedUsers(prev =>
                                prev.filter(u => u._id !== user._id)
                              )}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )} */}

                <div className="modal-buttons">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? t('common.loading') : (editingVoucher ? t('common.update') : t('common.add'))}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default VoucherScreen;
