import api from './api';

export const ticketService = {
  getTickets: async (params = {}) => {
    try {
      const response = await api.get('/api/admin/tickets', { params });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
      throw error;
    }
  },

  updateTicket: async (id, data) => {
    try {
      // data deve ser algo como { status: 2 }
      const response = await api.patch(`/api/admin/tickets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar ticket ${id}:`, error);
      throw error;
    }
  }
};