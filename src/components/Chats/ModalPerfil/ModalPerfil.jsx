import React from "react";
import "./ModalPerfil.css";
import {
  X,
  User,
  Calendar,
  Tag,
  Activity,
  Info,
  MessageCircle,
} from "lucide-react";

export function ModalPerfil({ isOpen, onClose, user }) {
  // Debug para você ver no console do navegador (F12)
  console.log("Dados do usuário no modal:", user);

  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getLeadSource = () => {
    if (user.metadata && user.metadata.raw_event) {
      return user.metadata.raw_event;
    }
    return user.platform || "Desconhecido";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Perfil do Cliente</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        <div className="modal-body">
          <div className="profile-main-info">
            <div className="profile-avatar">{user.name.charAt(0)}</div>
            <h3>{user.name}</h3>
            <span className={`status-badge ${user.status}`}>{user.status}</span>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>
                <User size={16} /> ID do Sistema
              </label>
              <span>{user.id}</span>
            </div>
            <div className="info-item">
              <label>
                <Tag size={16} /> ID Externo
              </label>
              <span>{user.external_id || "N/A"}</span>
            </div>
            <div className="info-item">
              <label>
                <Calendar size={16} /> Criado em
              </label>
              <span>{formatDate(user.created_at)}</span>
            </div>
            <div className="info-item">
              <label>
                <Activity size={16} /> Plataforma
              </label>
              <span className="capitalize">{user.platform}</span>
            </div>

            {/* Exibição da contagem */}
            <div className="info-item">
              <label>
                <MessageCircle size={16} /> Total de Mensagens
              </label>
              <span>
                {user.message_count !== undefined ? user.message_count : 0}{" "}
                interações
              </span>
            </div>

            <div className="info-item full-width">
              <label>
                <Info size={16} /> Origem do Lead
              </label>
              <div className="lead-source-box">{getLeadSource()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
