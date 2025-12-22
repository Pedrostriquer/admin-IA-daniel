import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Chats.css';
import { chatService } from '../../services/chatService';
import { Search, Globe, Instagram, Send, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export function Chats() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('');
  const [page, setPage] = useState(1);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Função para limpar tags customizadas como <negrito> na lista lateral
  const stripTags = (text) => {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, ''); // Remove qualquer coisa entre < >
  };

  useEffect(() => {
    async function loadChats() {
      try {
        const response = await chatService.getChats({ page, platform, search, limit: 10 });
        setChats(response.data);
      } catch (error) {
        console.error("Erro ao carregar chats:", error);
      }
    }
    loadChats();
  }, [page, platform, search]);

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filters">
            <button className={platform === '' ? 'active' : ''} onClick={() => setPlatform('')}>Todos</button>
            <button className={platform === 'website' ? 'active' : ''} onClick={() => setPlatform('website')}>
              <Globe size={14} /> Site
            </button>
            <button className={platform === 'instagram' ? 'active' : ''} onClick={() => setPlatform('instagram')}>
              <Instagram size={14} /> Insta
            </button>
          </div>
        </header>

        <div className="chats-list">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-card ${selectedChat?.id === chat.id ? 'selected' : ''}`}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="avatar-wrapper">
                <div className="avatar-initials">{chat.name.charAt(0)}</div>
                <div className={`platform-badge ${chat.platform}`}>
                  {chat.platform === 'website' ? <Globe size={10} /> : <Instagram size={10} />}
                </div>
              </div>
              <div className="chat-info">
                <div className="chat-info-top">
                  <span className="customer-name">{chat.name}</span>
                  <span className="chat-time">
                    {chat.last_message_at ? new Date(chat.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                  </span>
                </div>
                {/* Aqui limpamos a mensagem para o preview na lista lateral */}
                <p className="last-message">{stripTags(chat.last_message_content)}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="pagination-footer">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft size={18} />
          </button>
          <span>Página {page}</span>
          <button onClick={() => setPage(p => p + 1)}>
            <ChevronRight size={18} />
          </button>
        </footer>
      </aside>

      <main className="chat-window">
        {selectedChat ? (
          <>
            <header className="chat-header">
              <div className="header-user">
                <div className="avatar-initials">{selectedChat.name.charAt(0)}</div>
                <div>
                  <h3>{selectedChat.name}</h3>
                  <span className="status">Online via {selectedChat.platform}</span>
                </div>
              </div>
              <MoreVertical size={20} className="clickable" />
            </header>

            <div className="messages-container">
              {loadingMessages ? (
                <div className="loading-state">Carregando mensagens...</div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`message-row ${msg.role}`}>
                    <div className="message-bubble">
                      <div className="markdown-content">
                        {/* No chat principal, usamos Markdown normalmente */}
                        <ReactMarkdown>
                          {msg.content?.replace(/<negrito>/g, '**').replace(/<\/negrito>/g, '**')}
                        </ReactMarkdown>
                      </div>
                      <span className="msg-time">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <footer className="chat-input-area">
              <div className="input-box">
                <input type="text" placeholder="Escreva sua mensagem..." />
                <button className="send-button">
                  <Send size={20} />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state-icon">💬</div>
            <h2>Selecione um chat para começar</h2>
            <p>Gerencie suas conversas multiplataforma em um só lugar.</p>
          </div>
        )}
      </main>
    </div>
  );
}