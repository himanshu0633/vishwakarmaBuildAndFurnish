// frontend/src/utils/axiosConfig.js
import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api', // Your backend URL
  // baseURL: 'https://nbnl6p1j-4000.inc1.devtunnels.ms/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const API_ORIGIN = axiosInstance.defaults.baseURL.replace(/\/api\/?$/, '');

export const getStaticAssetUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url.replace('/api/uploads/', '/uploads/');

  const cleanUrl = url.startsWith('/api/uploads/')
    ? url.replace('/api/uploads/', '/uploads/')
    : url;

  return `${API_ORIGIN}${cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`}`;
};

export const logStaticAssetUrl = (label, rawUrl) => {
  const resolvedUrl = getStaticAssetUrl(rawUrl);
  console.log(`[media-url] ${label}`, {
    apiBaseUrl: axiosInstance.defaults.baseURL,
    apiOrigin: API_ORIGIN,
    rawUrl,
    resolvedUrl
  });
  return resolvedUrl;
};

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
