import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Chats } from './components/Chats/Chats';
import { Login } from './components/Login/Login';
import { Tickets } from './components/Tickets/Tickets';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Profile } from './components/Profile/Profile'; // Importação do novo componente
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
        <Route path="/dashboard" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />

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

        {/* Rota de Perfil (onde será feito o cadastro de novos admins) */}
        <Route path="/profile" element={
          <Layout>
            <Profile />
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