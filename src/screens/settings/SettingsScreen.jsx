import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/UserService';
import './SettingsScreen.css';

const SettingsScreen = () => {
  const { updateUserContext } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    birthDate: '',  // Đổi từ birth_date sang birthDate
    sex: 'male',    // Đổi từ gender sang sex
    avatar: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user data when component mounts
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setFormData({
        username: userInfo.username || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        birthDate: userInfo.birthDate ? new Date(userInfo.birthDate).toISOString().split('T')[0] : '',
        sex: userInfo.sex || 'male',
      });
      setPreviewImage(userInfo.avatar);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo?._id) {
        throw new Error('User ID not found');
      }

      const formDataToSend = new FormData();

      // Append all form data except email
      Object.keys(formData).forEach(key => {
        if (key !== 'email' && formData[key] !== null) {
          if (key === 'avatar' && formData[key] instanceof File) {
            formDataToSend.append('avatar', formData[key]);
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      // Debug log
      console.log('FormData content:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await userService.updateUser(userInfo._id, formDataToSend);

      if (response.status === 200) {
        const updatedUser = {
          ...userInfo,
          ...response.data.data
        };

        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        updateUserContext(updatedUser);

        alert('Cập nhật thông tin thành công');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="settings-container">
        <div className="settings-content">
          <h1>Cài đặt tài khoản</h1>

          <form onSubmit={handleSubmit} className="settings-form">
            <div className="avatar-section">
              <div className="avatar-preview">
                <img
                  src={previewImage || '/default-avatar.png'}
                  alt="Profile"
                />
                <div className="avatar-overlay">
                  <label htmlFor="avatar-input" className="upload-button">
                    <i className="fas fa-camera"></i>
                  </label>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Tên người dùng</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]*"
                />
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  name="birthDate"  // Đổi từ birth_date sang birthDate
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label>Giới tính</label>
                <select
                  name="sex"     // Đổi từ gender sang sex
                  value={formData.sex}
                  onChange={handleInputChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsScreen;