import api from './api';

export const ticketService = {
  /**
   * Listar Tickets com filtros
   * @param {Object} params - page, limit, status, emergency_level
   */
  getTickets: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/tickets', { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
      throw error;
    }
  },

  /**
   * Atualizar status ou nota de um ticket
   */
  updateTicket: async (id, data) => {
    try {
      const response = await api.patch(`/api/admin/tickets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar ticket ${id}:`, error);
      throw error;
    }
  }
};