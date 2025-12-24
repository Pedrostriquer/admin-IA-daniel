import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { 
  UserPlus, 
  Mail, 
  User as UserIcon, 
  Lock, 
  Loader2, 
  CheckCircle,
  ShieldCheck,
  IdCard
} from 'lucide-react';
import './Profile.css';

export function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setCurrentUser(user);
  }, []);

  // Extrai a inicial do nome para o Avatar
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.register(formData);
      setMessage({ type: 'success', text: 'Novo administrador cadastrado com sucesso!' });
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao cadastrar.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container-inner">
        
        {/* CARD PRINCIPAL DO USUÁRIO */}
        <div className="profile-main-card">
          <div className="profile-banner">
            <div className="banner-texture"></div>
          </div>
          
          <div className="profile-avatar-container">
            <div className="profile-avatar-circle">
              {getInitial(currentUser?.name)}
            </div>
          </div>

          <div className="profile-info-section">
            <div className="profile-info-header">
              <h1>{currentUser?.name}</h1>
              <span className="badge-admin">
                <ShieldCheck size={14} /> Administrador
              </span>
            </div>

            <div className="info-grid-details">
              <div className="info-item">
                <Mail size={18} className="info-icon" />
                <div className="info-text">
                  <label>E-mail Corporativo</label>
                  <span>{currentUser?.email}</span>
                </div>
              </div>
              <div className="info-item">
                <IdCard size={18} className="info-icon" />
                <div className="info-text">
                  <label>ID de Usuário</label>
                  <span>#{currentUser?.id || '---'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD DE CADASTRO - SEPARADO */}
        <div className="registration-card">
          <div className="card-header">
            <div className="header-icon">
              <UserPlus size={20} />
            </div>
            <div className="header-titles">
              <h3>Gestão de Acesso</h3>
              <p>Crie novas contas administrativas para a plataforma.</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="registration-form">
            <div className="form-row">
              <div className="input-container">
                <label>Nome Completo</label>
                <div className="input-wrapper">
                  <UserIcon size={18} className="field-icon" />
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-container">
                <label>E-mail de Acesso</label>
                <div className="input-wrapper">
                  <Mail size={18} className="field-icon" />
                  <input 
                    type="email" 
                    placeholder="email@goldia.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="input-container">
              <label>Senha Provisória</label>
              <div className="input-wrapper">
                <Lock size={18} className="field-icon" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>

            {message.text && (
              <div className={`status-message ${message.type}`}>
                {message.type === 'success' && <CheckCircle size={18} />}
                {message.text}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <Loader2 className="spinner" /> : "Finalizar Cadastro"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}