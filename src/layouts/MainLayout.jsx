// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  // Khởi tạo state từ localStorage hoặc mặc định là false
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Lưu trạng thái vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <div className={`layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="main-wrapper">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;