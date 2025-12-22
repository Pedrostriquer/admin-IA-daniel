import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Chats } from './components/Chats/Chats';
import { Login } from './components/Login/Login';
import { Tickets } from './components/Tickets/Tickets';
import './App.css';

// Componente para envolver páginas que precisam da Sidebar
const Layout = ({ children }) => {
  return (
    <div className="app-container" style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <Sidebar />
      <main className="content" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas (com Sidebar) */}
        <Route path="/chats" element={
          <Layout>
            <Chats />
          </Layout>
        } />

        <Route path="/tickets" element={
          <Layout>
            <Tickets />
          </Layout>
        } />
        
        <Route path="/dashboard" element={
          <Layout>
            <div style={{ padding: '32px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Dashboard</h1>
              <p style={{ color: '#6F767E', marginTop: '8px' }}>Estatísticas em breve...</p>
            </div>
          </Layout>
        } />

        {/* Redirecionamentos */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;