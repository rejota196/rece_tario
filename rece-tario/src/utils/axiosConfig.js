import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://sandbox.academiadevelopers.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
  } else {
    console.error("localStorage no está disponible");
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
