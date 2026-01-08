import React, { useEffect, useState, useCallback } from "react";
import { ticketService } from "../../services/ticketService";
import {
  Search,
  ChevronDown,
  User,
  Hash,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  X,
  Clock,
  AlertCircle,
  Zap,
  PlayCircle,
  Ban,
  RotateCcw,
  Loader2,
} from "lucide-react";
import "./Tickets.css";

const STATUS_MAP = {
  1: { label: "Pendente", color: "#EAB308", icon: <Clock size={14} /> },
  2: { label: "Em Análise", color: "#3B82F6", icon: <PlayCircle size={14} /> },
  3: { label: "Resolvido", color: "#38A169", icon: <CheckCircle2 size={14} /> },
  4: { label: "Cancelado", color: "#EF4444", icon: <Ban size={14} /> },
};

export function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null); // Estado para animação de "fazendo o trem"
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [exitingId, setExitingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        emergency_level: priority || undefined,
        status: status !== "" ? status : undefined,
      };
      const response = await ticketService.getTickets(params);
      setTickets(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, priority, status]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setLoadingId(id); // Inicia animação de carregamento no card
      await ticketService.updateTicket(id, { status: newStatus });

      const statusLabel = STATUS_MAP[newStatus].label;

      if (status !== "" && Number(status) !== newStatus) {
        setExitingId(id);
        setToast({
          show: true,
          message: `Ticket #${id} movido para ${statusLabel}!`,
        });
        setTimeout(() => {
          setTickets((prev) => prev.filter((t) => t.id !== id));
          setExitingId(null);
          setLoadingId(null);
          if (expandedId === id) setExpandedId(null);
        }, 800);
      } else {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
        setToast({
          show: true,
          message: `Sucesso! Ticket #${id} agora está ${statusLabel}.`,
        });
        setLoadingId(null);
      }

      setTimeout(() => setToast({ show: false, message: "" }), 3500);
    } catch (err) {
      console.error(err);
      setLoadingId(null);
      setToast({ show: true, message: "Erro ao atualizar status." });
    }
  };

  const getPriorityIcon = (level) => {
    switch (level) {
      case "urgente":
        return <Zap size={14} />;
      case "prioritario":
        return <AlertCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <div className="tickets-container">
      <header className="tickets-header">
        <div className="title-section">
          <h1>Central de Suporte</h1>
          <div className="total-badge">{pagination.total} Tickets</div>
        </div>

        <div className="filters-bar">
          <div className="search-group">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar pelo título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="select-group">
            <select
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Prioridade</option>
              <option value="normal">Normal</option>
              <option value="prioritario">Prioritário</option>
              <option value="urgente">Urgente</option>
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos Status</option>
              <option value="1">Pendente</option>
              <option value="2">Em Análise</option>
              <option value="3">Resolvido</option>
              <option value="4">Cancelado</option>
            </select>
          </div>
        </div>
      </header>

      <div className="tickets-list">
        {loading ? (
          <div className="state-msg">Carregando informações...</div>
        ) : tickets.length === 0 ? (
          <div className="state-msg">Nenhum ticket encontrado.</div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`ticket-card 
                ${expandedId === ticket.id ? "active" : ""} 
                ${exitingId === ticket.id ? "exit-anim" : ""} 
                ${loadingId === ticket.id ? "is-processing" : ""}`}
            >
              {loadingId === ticket.id && (
                <div className="card-processing-overlay">
                  <Loader2 className="spinner-icon" size={24} />
                  <span>Atualizando...</span>
                </div>
              )}

              <div
                className="card-header"
                onClick={() =>
                  loadingId !== ticket.id &&
                  setExpandedId(expandedId === ticket.id ? null : ticket.id)
                }
              >
                <div className="header-left">
                  <div className="ticket-number">#{ticket.id}</div>
                  <h3 className="ticket-title">{ticket.title}</h3>
                </div>

                <div className="header-right">
                  <span className={`badge-prio ${ticket.emergency_level}`}>
                    {getPriorityIcon(ticket.emergency_level)}
                    {ticket.emergency_level}
                  </span>
                  <div className="header-date">
                    <Calendar size={14} />
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                  <div
                    className={`arrow-icon ${
                      expandedId === ticket.id ? "rotate" : ""
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>

              {expandedId === ticket.id && (
                <div className="card-body">
                  <div className="body-grid">
                    <div className="info-main">
                      <label>Descrição detalhada</label>
                      <p>{ticket.description}</p>
                    </div>

                    <div className="info-sidebar">
                      <label>Dados do Chamado</label>
                      <div className="info-row">
                        <User size={16} />
                        <span>
                          Cliente: <strong>{ticket.client_id}</strong>
                        </span>
                      </div>
                      {ticket.contract_id && (
                        <div className="info-row">
                          <Hash size={16} />
                          <span>
                            Contrato: <strong>{ticket.contract_id}</strong>
                          </span>
                        </div>
                      )}
                      <div className="info-row">
                        <Clock size={16} />
                        <span>
                          Status:{" "}
                          <strong
                            style={{ color: STATUS_MAP[ticket.status].color }}
                          >
                            {STATUS_MAP[ticket.status].label}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <div className="action-btns-group">
                      {ticket.status === 1 && (
                        <>
                          <button
                            className="btn-act btn-analyze"
                            onClick={() => handleUpdateStatus(ticket.id, 2)}
                          >
                            <PlayCircle size={16} /> Em Análise
                          </button>
                          <button
                            className="btn-act btn-resolve-new"
                            onClick={() => handleUpdateStatus(ticket.id, 3)}
                          >
                            <CheckCircle2 size={16} /> Resolvido
                          </button>
                          <button
                            className="btn-act btn-cancel"
                            onClick={() => handleUpdateStatus(ticket.id, 4)}
                          >
                            <Ban size={16} /> Cancelar
                          </button>
                        </>
                      )}

                      {ticket.status === 2 && (
                        <>
                          <button
                            className="btn-act btn-pending"
                            onClick={() => handleUpdateStatus(ticket.id, 1)}
                          >
                            <RotateCcw size={16} /> Voltar p/ Pendente
                          </button>
                          <button
                            className="btn-act btn-resolve-new"
                            onClick={() => handleUpdateStatus(ticket.id, 3)}
                          >
                            <CheckCircle2 size={16} /> Resolvido
                          </button>
                          <button
                            className="btn-act btn-cancel"
                            onClick={() => handleUpdateStatus(ticket.id, 4)}
                          >
                            <Ban size={16} /> Cancelar
                          </button>
                        </>
                      )}

                      {ticket.status === 3 && (
                        <>
                          <button
                            className="btn-act btn-analyze"
                            onClick={() => handleUpdateStatus(ticket.id, 2)}
                          >
                            <PlayCircle size={16} /> Em Análise
                          </button>
                          <button
                            className="btn-act btn-cancel"
                            onClick={() => handleUpdateStatus(ticket.id, 4)}
                          >
                            <Ban size={16} /> Cancelar
                          </button>
                        </>
                      )}

                      {ticket.status === 4 && (
                        <button
                          className="btn-act btn-pending"
                          onClick={() => handleUpdateStatus(ticket.id, 1)}
                        >
                          <RotateCcw size={16} /> Reabrir Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <footer className="pagination-bar">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="nav-btn"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="page-counter">
          Página <strong>{page}</strong> de {pagination.totalPages}
        </span>
        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="nav-btn"
        >
          <ChevronRight size={18} />
        </button>
      </footer>

      {toast.show && (
        <div className="modern-toast">
          <CheckCircle2 size={20} className="toast-icon-check" />
          <span>{toast.message}</span>
          <button
            className="toast-close-btn"
            onClick={() => setToast({ show: false, message: "" })}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
