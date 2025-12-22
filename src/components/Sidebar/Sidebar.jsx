import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap 
} from 'lucide-react';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          {!isCollapsed && <span className="logo-text">AI<span className="gold-text">PLATFORM</span></span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutDashboard size={22} />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/chats" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <MessageSquare size={22} />
          {!isCollapsed && <span>Chats</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-link">
          <Settings size={22} />
          {!isCollapsed && <span>Configurações</span>}
        </NavLink>
      </div>
    </aside>
  );
}