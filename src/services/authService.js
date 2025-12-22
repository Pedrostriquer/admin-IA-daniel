import api from './api';

export const authService = {
  /**
   * Realiza o login do usuário
   * @param {string} email 
   * @param {string} password 
   */
  login: async (email, password) => {
    try {
      // Como a baseURL agora é http://localhost:3000, esta rota será exata
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }
};