import axios from 'axios';

const api = axios.create({
  baseURL: 'https://verticalaidaniel.softwarehousecaiuademello.com.br', // Alterado para a raiz para suportar todas as rotas
  headers: {
    'accept': '*/*',
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;