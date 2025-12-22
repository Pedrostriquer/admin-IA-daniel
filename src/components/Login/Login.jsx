import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/chats');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="unified-login-card">
        
        {/* LADO VISUAL (GRADIENTE) - OCUPA MENOS ESPAÇO */}
        <div className="login-visual-part">
          <div className="shader-layer">
            <ShaderGradientCanvas
              style={{ position: 'absolute', inset: 0 }}
              pixelDensity={1}
              fov={45}
            >
              <ShaderGradient
                animate="on"
                brightness={1.2}
                cAzimuthAngle={180}
                cDistance={3.6}
                cPolarAngle={90}
                cameraZoom={1}
                color1="#ecff19"
                color2="#c4c100"
                color3="#e1cb00"
                envPreset="city"
                grain="on"
                lightType="3d"
                positionX={-1.4}
                rotationY={10}
                rotationZ={50}
                uFrequency={5.5}
                uSpeed={0.4}
                uStrength={3.4}
              />
            </ShaderGradientCanvas>
            <div className="shader-overlay"></div>
          </div>
          
          <div className="visual-content-wrapper">
            <div className="brand-header">
              <span className="brand-symbol">*</span>
              <span className="brand-text">GOLD IA</span>
            </div>
            <div className="brand-footer-msg">
              <span className="kicker">PLATAFORMA ADMINISTRATIVA</span>
              <h1>Acesse seu hub pessoal para clareza e produtividade.</h1>
            </div>
          </div>
        </div>

        {/* LADO DO FORMULÁRIO - OCUPA MAIS ESPAÇO */}
        <div className="login-form-part">
          <div className="form-container-inner">
            <header>
              <h2>Bem-vindo</h2>
              <p>Gerencie seus atendimentos com inteligência.</p>
            </header>

            <form onSubmit={handleSubmit} className="login-main-form">
              <div className="form-group">
                <label>E-mail</label>
                <div className="input-with-icon">
                  <Mail size={18} className="lead-icon" />
                  <input 
                    type="email" 
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Senha</label>
                <div className="input-with-icon">
                  <Lock size={18} className="lead-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="eye-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <div className="login-error-box">{error}</div>}

              <button type="submit" className="login-action-btn" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Entrar na conta"}
              </button>
            </form>

            <div className="form-footer-copyright">
              © 2025 Gold IA Platform.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}