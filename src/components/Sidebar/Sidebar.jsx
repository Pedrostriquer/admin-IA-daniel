import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Ticket,
  LogOut 
} from 'lucide-react';
import './Sidebar.css';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="collapse-btn" 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className="sidebar-header">
        <div className="logo-container">
          <Zap size={24} fill="#FFD700" color="#FFD700" />
          {!isCollapsed && (
            <span className="logo-text">
              GOLD <span className="gold-text">IA</span>
            </span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <LayoutDashboard size={22} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink 
          to="/chats" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <MessageSquare size={22} />
          {!isCollapsed && <span>Chats</span>}
        </NavLink>

        <NavLink 
          to="/tickets" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <Ticket size={22} />
          {!isCollapsed && <span>Tickets</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          <Settings size={22} />
          {!isCollapsed && <span>Configurações</span>}
        </NavLink>

        <button className="nav-link logout-btn" onClick={handleLogout}>
          <LogOut size={22} />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}