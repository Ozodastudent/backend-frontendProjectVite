import axios from 'axios';

const api = axios.create({
  baseURL: 'https://katlavan24.uz/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Dynamically get CSRF token from cookie (assuming it's set by the server)
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  if (csrfToken) {
    config.headers['X-CSRFTOKEN'] = csrfToken;
  }
  return config;
});

export default api;