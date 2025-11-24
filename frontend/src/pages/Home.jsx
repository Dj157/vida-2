import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { getMonitoramento } from "../services/api";

export default function Home() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getMonitoramento();
        if (mounted) setDados(data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        if (mounted) setError("Erro ao buscar dados do backend. Verifique se o backend está rodando.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const handleSOS = () => {
    alert("🚨 BOTÃO SOS ACIONADO! Entrando em contato com o cuidador...");
  };

  // Função para determinar status baseado em valores
  const getHealthStatus = (heartRate, steps, sleep) => {
    if (heartRate > 120 || steps < 500 || sleep < 4) return { status: "🔴 CRÍTICO", color: "#dc3545" };
    if (heartRate > 100 || steps < 1000 || sleep < 5.5) return { status: "🟡 ATENÇÃO", color: "#ffc107" };
    return { status: "🟢 BOM", color: "#28a745" };
  };

  const healthStatus = dados ? getHealthStatus(dados.heart_rate, dados.steps_count, dados.sleep_duration_hours) : null;

  return (
    <MainLayout>
      <div className="container">
        <header className="header">
          <h1>🏥 Vida+Ativa</h1>
          <p className="subtitle">Sistema de Monitoramento de Saúde para Idosos</p>
        </header>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>⏳ Carregando dados...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>❌ {error}</p>
          </div>
        )}

        {dados && (
          <div className="content">
            {/* Status Geral */}
            <div className="status-banner" style={{ borderColor: healthStatus.color }}>
              <span style={{ color: healthStatus.color, fontSize: "24px" }}>{healthStatus.status}</span>
              <span className="user-id">ID: {dados.user_id}</span>
            </div>

            {/* Dados Vitais */}
            <section className="vitals-section">
              <h2>📊 Dados Vitais</h2>
              <div className="vitals-grid">
                {/* Frequência Cardíaca */}
                <div className={`vital-card ${dados.heart_rate > 100 ? "alert" : ""}`}>
                  <div className="vital-icon">❤️</div>
                  <p className="vital-label">Frequência Cardíaca</p>
                  <p className="vital-value">{dados.heart_rate}</p>
                  <p className="vital-unit">bpm</p>
                  <p className="vital-range">Normal: 60-100</p>
                </div>

                {/* Passos */}
                <div className={`vital-card ${dados.steps_count < 1000 ? "alert" : ""}`}>
                  <div className="vital-icon">👣</div>
                  <p className="vital-label">Passos (24h)</p>
                  <p className="vital-value">{dados.steps_count}</p>
                  <p className="vital-unit">passos</p>
                  <p className="vital-range">Recomendado: 1000+</p>
                </div>

                {/* Sono */}
                <div className={`vital-card ${dados.sleep_duration_hours < 5.5 ? "alert" : ""}`}>
                  <div className="vital-icon">😴</div>
                  <p className="vital-label">Horas de Sono</p>
                  <p className="vital-value">{dados.sleep_duration_hours}</p>
                  <p className="vital-unit">horas</p>
                  <p className="vital-range">Recomendado: 6-8h</p>
                </div>
              </div>
            </section>

            {/* Análise de IA */}
            <section className="analysis-section">
              <h2>🤖 Análise Personalizada de IA</h2>
              <div className="analysis-box">
                <div className="analysis-content">
                  {dados.analysis || "Carregando análise..."}
                </div>
              </div>
            </section>

            {/* Alerta SOS */}
            {dados.sos_alert && (
              <section className="sos-alert-section">
                <div className="sos-alert-content">
                  <h3>🚨 ALERTA SOS ACIONADO!</h3>
                  <p>Frequência cardíaca elevada detectada (> 120 bpm).</p>
                  <p className="sos-alert-warning">⚠️ Recomenda-se entrar em contato com um profissional de saúde imediatamente.</p>
                </div>
              </section>
            )}

            {/* Botão SOS */}
            <section className="sos-button-section">
              <button className="sos-button" onClick={handleSOS}>
                🚨 ATIVAR SOS
              </button>
              <p className="sos-help">Pressione para alertar o cuidador</p>
            </section>

            {/* Rodapé com timestamp */}
            <footer className="footer">
              <p>⏰ Última atualização: {new Date(dados.timestamp).toLocaleString("pt-BR")}</p>
            </footer>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
        }

        .header h1 {
          font-size: 36px;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .subtitle {
          font-size: 14px;
          opacity: 0.9;
          font-weight: 300;
        }

        .content {
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .spinner {
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 4px solid #e0e0e0;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Error State */
        .error-state {
          background: #fff5f5;
          border: 2px solid #fc8181;
          color: #c53030;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
        }

        /* Status Banner */
        .status-banner {
          background: white;
          border-left: 6px solid;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          font-weight: 600;
          font-size: 18px;
        }

        .user-id {
          color: #666;
          font-size: 14px;
          font-weight: 400;
        }

        /* Vitals Section */
        .vitals-section {
          margin-bottom: 40px;
        }

        .vitals-section h2 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .vital-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .vital-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .vital-card.alert {
          background: linear-gradient(135deg, #fff9e6 0%, #ffeccc 100%);
          border-color: #ffc107;
        }

        .vital-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .vital-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .vital-value {
          font-size: 42px;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 5px;
        }

        .vital-unit {
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
        }

        .vital-range {
          font-size: 11px;
          color: #999;
          background: #f8f9fa;
          padding: 8px 12px;
          border-radius: 6px;
          margin-top: 10px;
        }

        /* Analysis Section */
        .analysis-section {
          margin-bottom: 40px;
        }

        .analysis-section h2 {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .analysis-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        .analysis-content {
          padding: 30px;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          line-height: 1.8;
          color: #333;
          font-size: 15px;
          text-align: justify;
        }

        /* SOS Alert */
        .sos-alert-section {
          background: linear-gradient(135deg, #fff5f5 0%, #ffe0e0 100%);
          border: 2px solid #fc8181;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }

        .sos-alert-content h3 {
          color: #c53030;
          font-size: 20px;
          margin-bottom: 10px;
        }

        .sos-alert-content p {
          color: #742a2a;
          margin-bottom: 8px;
        }

        .sos-alert-warning {
          font-weight: 600;
          color: #c53030;
        }

        /* SOS Button Section */
        .sos-button-section {
          text-align: center;
          margin-bottom: 40px;
        }

        .sos-button {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          padding: 18px 60px;
          font-size: 20px;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .sos-button:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6);
        }

        .sos-button:active {
          transform: scale(0.95);
        }

        .sos-help {
          color: #666;
          font-size: 12px;
          margin-top: 12px;
          font-weight: 500;
        }

        /* Footer */
        .footer {
          text-align: center;
          color: #999;
          font-size: 12px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 10px;
          margin-top: 20px;
        }

        /* Responsivo */
        @media (max-width: 768px) {
          .header h1 {
            font-size: 28px;
          }

          .vitals-grid {
            grid-template-columns: 1fr;
          }

          .vital-value {
            font-size: 32px;
          }

          .status-banner {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .sos-button {
            padding: 15px 40px;
            font-size: 18px;
          }
        }
      `}</style>
    </MainLayout>
  );
}
