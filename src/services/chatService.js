import api from './api';

export const chatService = {
  /**
   * Listar Chats
   * @param {Object} params - page, limit, platform, search
   */
  getChats: async (params = {}) => {
    try {
      // Prefixo /api para coincidir com a configuração da baseURL
      const response = await api.get('/api/admin/chats', { params });
      return response.data; 
      // Retorna { data: [...], pagination: {...} }
    } catch (error) {
      console.error("Erro ao buscar chats:", error);
      throw error;
    }
  },

  /**
   * Ver Mensagens do Chat
   * @param {number|string} chatId 
   * @param {Object} params - page, limit
   */
  getChatMessages: async (chatId, params = { limit: 50 }) => {
    try {
      const response = await api.get(`/api/admin/chats/${chatId}/messages`, { params });
      return response.data;
      // Retorna { data: [...], pagination: {...} }
    } catch (error) {
      console.error(`Erro ao buscar mensagens do chat ${chatId}:`, error);
      throw error;
    }
  },

  /**
   * Estatísticas de Conversas (Dashboard)
   * Retorna totais, atividade de hoje e crescimento
   */
  getStats: async () => {
    try {
      const response = await api.get('/api/admin/stats/chats');
      return response.data;
      // Retorna { totals: {...}, today: {...}, growth_vs_yesterday: {...} }
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }
};