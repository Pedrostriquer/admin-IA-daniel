import React, { useEffect, useState, useCallback } from 'react';
import { ticketService } from '../../services/ticketService';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  User, 
  Hash, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import './Tickets.css';

export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  
  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        emergency_level: priority || undefined,
        status: status !== '' ? status : undefined,
        // search: searchTerm // Se sua API suportar busca por texto
      };
      
      const response = await ticketService.getTickets(params);
      setTickets(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Erro ao carregar tickets:", err);
    } finally {
      setLoading(false);
    }
  }, [page, priority, status]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getPriorityClass = (level) => {
    const classes = {
      urgente: 'prio-urgente',
      prioritario: 'prio-prioritario',
      normal: 'prio-normal'
    };
    return classes[level] || 'prio-normal';
  };

  return (
    <div className="tickets-container">
      <header className="tickets-header">
        <div className="title-section">
          <h1>Tickets de Suporte</h1>
          <span className="total-badge">{pagination.total} Total</span>
        </div>

        <div className="filters-bar">
          <div className="search-input">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por título..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select value={priority} onChange={(e) => {setPriority(e.target.value); setPage(1)}}>
            <option value="">Todas Prioridades</option>
            <option value="normal">Normal</option>
            <option value="prioritario">Prioritário</option>
            <option value="urgente">Urgente</option>
          </select>

          <select value={status} onChange={(e) => {setStatus(e.target.value); setPage(1)}}>
            <option value="">Todos Status</option>
            <option value="1">Aberto</option>
            <option value="0">Resolvido</option>
          </select>
        </div>
      </header>

      <div className="tickets-list">
        {loading ? (
          <div className="empty-state">Carregando tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">Nenhum ticket encontrado.</div>
        ) : (
          tickets.map(ticket => (
            <div 
              key={ticket.id} 
              className={`ticket-item ${expandedId === ticket.id ? 'expanded' : ''}`}
            >
              {/* Preview / Cabeçalho do Item */}
              <div className="ticket-item-header" onClick={() => toggleExpand(ticket.id)}>
                <div className="header-main">
                  <span className="ticket-id">#{ticket.id}</span>
                  <h3 className="ticket-title">{ticket.title}</h3>
                </div>
                
                <div className="header-meta">
                  <span className={`priority-tag ${getPriorityClass(ticket.emergency_level)}`}>
                    {ticket.emergency_level}
                  </span>
                  <span className="date-text">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                  {expandedId === ticket.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Conteúdo Expandido */}
              {expandedId === ticket.id && (
                <div className="ticket-item-content">
                  <div className="content-grid">
                    <div className="description-section">
                      <h4>Descrição do Problema</h4>
                      <p>{ticket.description}</p>
                    </div>
                    
                    <div className="details-section">
                      <h4>Informações Adicionais</h4>
                      <div className="detail-row">
                        <User size={16} />
                        <span>ID Cliente: <strong>{ticket.client_id}</strong></span>
                      </div>
                      {ticket.contract_id && (
                        <div className="detail-row">
                          <Hash size={16} />
                          <span>Contrato: <strong>{ticket.contract_id}</strong></span>
                        </div>
                      )}
                      <div className="detail-row">
                        <Calendar size={16} />
                        <span>Atualizado em: {new Date(ticket.updated_at).toLocaleString()}</span>
                      </div>
                      <div className="detail-row">
                        <AlertTriangle size={16} />
                        <span>Status: <strong>{ticket.status === 1 ? 'Aberto' : 'Finalizado'}</strong></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="action-footer">
                    <button className="btn-resolve">Marcar como Resolvido</button>
                    <button className="btn-secondary">Enviar Mensagem</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      <footer className="pagination-footer">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
          className="page-btn"
        >
          <ChevronLeft size={18} /> Anterior
        </button>
        <span className="page-info">
          Página <strong>{pagination.page}</strong> de {pagination.totalPages}
        </span>
        <button 
          disabled={page === pagination.totalPages} 
          onClick={() => setPage(p => p + 1)}
          className="page-btn"
        >
          Próximo <ChevronRight size={18} />
        </button>
      </footer>
    </div>
  );
}