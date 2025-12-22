import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Chats } from './components/Chats/Chats';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            {/* Redireciona a rota raiz para /chats */}
            <Route path="/" element={<Navigate to="/chats" />} />
            <Route path="/chats" element={<Chats />} />
            {/* Outras rotas podem entrar aqui futuramente */}
            <Route path="/dashboard" element={<div>Dashboard em construção</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;