import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./Chats.css";
import { ModalPerfil } from "./ModalPerfil/ModalPerfil";
import { chatService } from "../../services/chatService";
import {
  Search,
  Globe,
  Instagram,
  Send,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Banknote,
} from "lucide-react";

const formatDateTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return timeStr;
  } else {
    const dateStr = date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
    });
    return `${dateStr} ${timeStr}`;
  }
};

export function Chats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [page, setPage] = useState(1);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stripTags = (text) => {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, "");
  };

  const renderPlatformIcon = (platformName, size = 14) => {
    switch (platformName) {
      case "website":
        return <Globe size={size} />;
      case "instagram":
        return <Instagram size={size} />;
      case "plataforma":
        return <MessageSquare size={size} />;
      default:
        return <MessageSquare size={size} />;
    }
  };

  useEffect(() => {
    async function loadChats() {
      try {
        const response = await chatService.getChats({
          page,
          platform,
          search,
          limit: 10,
        });
        setChats(response.data);
      } catch (error) {
        console.error("Erro ao carregar chats:", error);
      }
    }
    loadChats();
  }, [page, platform, search]);

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    setShowDropdown(false);
    setLoadingMessages(true);
    try {
      const response = await chatService.getChatMessages(chat.id);
      setMessages(response.data);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  return (
    <div className="chats-wrapper">
      <aside className="chats-sidebar">
        <header className="sidebar-top">
          <h1>Mensagens</h1>
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <button
              className={platform === "" ? "active" : ""}
              onClick={() => setPlatform("")}
            >
              Todos
            </button>
            <button
              className={platform === "website" ? "active" : ""}
              onClick={() => setPlatform("website")}
            >
              <Globe size={14} /> Site
            </button>
            <button
              className={platform === "instagram" ? "active" : ""}
              onClick={() => setPlatform("instagram")}
            >
              <Instagram size={14} /> Insta
            </button>
            <button
              className={platform === "plataforma" ? "active" : ""}
              onClick={() => setPlatform("plataforma")}
            >
              <MessageSquare size={14} /> Sistema
            </button>
          </div>
        </header>

        <div className="chats-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-card ${
                selectedChat?.id === chat.id ? "selected" : ""
              }`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="avatar-wrapper">
                <div className="avatar-initials">{chat.name.charAt(0)}</div>
                <div className={`platform-badge ${chat.platform}`}>
                  {renderPlatformIcon(chat.platform, 10)}
                </div>
              </div>
              <div className="chat-info">
                <div className="chat-info-top">
                  <div className="name-with-icon">
                    <span className="customer-name">{chat.name}</span>
                    {chat.budget && (
                      <Banknote
                        size={16}
                        className="budget-icon"
                        color="#22c55e"
                        style={{ marginLeft: "6px", display: "inline" }}
                        title={`Interesse de aporte: ${chat.budget}`}
                      />
                    )}
                  </div>
                  <span className="chat-time">
                    {formatDateTime(chat.last_message_at)}
                  </span>
                </div>
                <p className="last-message">
                  {stripTags(chat.last_message_content)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <footer className="pagination-footer">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <span>Página {page}</span>
          <button onClick={() => setPage((p) => p + 1)}>
            <ChevronRight size={18} />
          </button>
        </footer>
      </aside>

      <main className="chat-window">
        {selectedChat ? (
          <>
            <header className="chat-header">
              <div className="header-user">
                <div className="avatar-initials">
                  {selectedChat.name.charAt(0)}
                </div>
                <div>
                  <h3>{selectedChat.name}</h3>
                  <span className="status">
                    Online via{" "}
                    {selectedChat.platform === "plataforma"
                      ? "Sistema"
                      : selectedChat.platform}
                  </span>
                </div>
              </div>
              <div className="header-actions">
                {selectedChat.budget && (
                  <div className="header-budget-badge">
                    <Banknote size={18} color="#22c55e" />
                    <span className="budget-value">{selectedChat.budget}</span>
                  </div>
                )}
                <MoreVertical
                  size={20}
                  className="clickable"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="header-dropdown">
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setShowDropdown(false);
                      }}
                    >
                      <User size={16} /> Ver Perfil
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="messages-container">
              {loadingMessages ? (
                <div className="loading-state">Carregando mensagens...</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`message-row ${msg.role}`}>
                    <div className="message-bubble">
                      <div className="markdown-content">
                        <ReactMarkdown>
                          {msg.content
                            ?.replace(/<negrito>/g, "**")
                            .replace(/<\/negrito>/g, "**")}
                        </ReactMarkdown>
                      </div>
                      <span className="msg-time">
                        {formatDateTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state-icon">💬</div>
            <h2>Selecione um chat para começar</h2>
            <p>Gerencie suas conversas multiplataforma em um só lugar.</p>
          </div>
        )}
      </main>

      <ModalPerfil
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedChat}
      />
    </div>
  );
}
