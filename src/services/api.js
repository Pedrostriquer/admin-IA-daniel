import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Sua URL base conforme o log
  headers: {
    'accept': '*/*',
    'Content-Type': 'application/json'
  }
});

// Aqui você pode adicionar interceptors para tokens de autenticação no futuro
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token');
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;