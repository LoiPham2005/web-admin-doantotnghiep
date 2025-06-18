// src/authHeader.js
export const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken'); // hoặc từ cookies hoặc sessionStorage
    return token ? { Authorization: `Bearer ${token}` } : ({});
};

