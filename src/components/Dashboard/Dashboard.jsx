import React, { useState, useEffect } from 'react';
import { chatService } from '../../services/chatService';
import { 
  Users, Globe, Instagram, MessageSquare, 
  TrendingUp, TrendingDown, Activity, Zap,
  BarChart2, Clock
} from 'lucide-react';
import './Dashboard.css';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await chatService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Erro ao carregar stats:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) return <div className="loading-screen">Sincronizando dados...</div>;

  const totalGeral = stats.totals.geral || 1; // Referência para o cálculo das barras

  const chartData = [
    { 
      key: 'plataforma', 
      label: 'Sistema', 
      icon: <MessageSquare size={16} />, 
      total: stats.totals.plataforma,
      today: stats.today.plataforma,
      growth: stats.growth_vs_yesterday.plataforma
    },
    { 
      key: 'website', 
      label: 'Site', 
      icon: <Globe size={16} />, 
      total: stats.totals.website,
      today: stats.today.website,
      growth: stats.growth_vs_yesterday.website
    },
    { 
      key: 'instagram', 
      label: 'Instagram', 
      icon: <Instagram size={16} />, 
      total: stats.totals.instagram,
      today: stats.today.instagram,
      growth: stats.growth_vs_yesterday.instagram
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <header className="dash-header">
          <div className="header-info">
            <h1>Relatório de Performance</h1>
            {/* <p>Análise detalhada de interações e canais de atendimento</p> */}
          </div>
          <div className="last-update">
            <Clock size={14} />
            <span>Atualizado agora</span>
          </div>
        </header>

        {/* CARDS PRINCIPAIS */}
        <div className="main-stats-grid">
          <div className="stat-card gold-border">
            <div className="stat-icon dark"><Users size={22} color="#FFD700" /></div>
            <div className="stat-content">
              <span className="stat-label">Volume Total</span>
              <div className="stat-number">{stats.totals.geral}</div>
              <p className="stat-desc">Conversas acumuladas no histórico</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon gold"><Zap size={22} /></div>
            <div className="stat-content">
              <span className="stat-label">Atividade de Hoje</span>
              <div className="stat-number">{stats.today.total}</div>
              <p className="stat-desc">Novos atendimentos nas últimas 24h</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon gray"><TrendingUp size={22} /></div>
            <div className="stat-content">
              <span className="stat-label">Crescimento Geral</span>
              <div className={`stat-number ${stats.growth_vs_yesterday.total >= 0 ? 'pos' : 'neg'}`}>
                {stats.growth_vs_yesterday.total}%
              </div>
              <p className="stat-desc">Comparação direta com o dia anterior</p>
            </div>
          </div>
        </div>

        {/* SEÇÃO VISUAL: METADE GRAFICO / METADE METRICAS */}
        <div className="visual-section">
          <div className="chart-panel">
            <div className="panel-header">
              <BarChart2 size={18} />
              <h3>Distribuição Proporcional</h3>
            </div>
            
            <div className="bars-frame">
              {chartData.map(item => (
                <div className="bar-group" key={item.key}>
                  <div className="bar-value-top">{item.total}</div>
                  <div className="bar-hole">
                    <div 
                      className="bar-elevated-fill" 
                      style={{ height: `${(item.total / totalGeral) * 100}%` }}
                    >
                      <div className="bar-light-effect"></div>
                    </div>
                  </div>
                  <div className="bar-footer">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="details-panel">
            <h3>Métricas por Plataforma</h3>
            <div className="details-list">
              {chartData.map(item => (
                <div className="detail-item" key={item.key}>
                  <div className="detail-row-top">
                    <span className="platform-name">{item.label}</span>
                    <span className={`growth-tag ${item.growth >= 0 ? 'up' : 'down'}`}>
                      {item.growth}%
                    </span>
                  </div>
                  <div className="detail-row-bottom">
                    <div className="metric">
                      <span className="m-label">Hoje</span>
                      <span className="m-val">{item.today}</span>
                    </div>
                    <div className="metric">
                      <span className="m-label">Acumulado</span>
                      <span className="m-val">{item.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-footer">
              <Activity size={16} />
              <span>Dados baseados em {stats.totals.geral} interações totais</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}