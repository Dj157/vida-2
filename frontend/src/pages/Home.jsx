import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";

export default function Home() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Buscar dados do backend que incluem a análise de IA
    fetch("http://localhost:3001/monitoramento")
      .then((res) => res.json())
      .then((data) => {
        setDados(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao buscar dados do backend. Verifique se o backend está rodando.");
        setLoading(false);
      });
  }, []);

  const handleSOS = () => {
    alert("🚨 BOTÃO SOS ACIONADO! Entrando em contato com o cuidador...");
    // Aqui entraria a lógica para enviar notificação ao cuidador
    // Por enquanto, apenas mostramos um alerta.
  };

  return (
    <MainLayout>
      <div className="container">
        <h1>🏥 Monitoramento de Saúde - Vida+Ativa</h1>

        {loading && <p>⏳ Carregando dados...</p>}

        {error && <p style={{ color: "red" }}>❌ {error}</p>}

        {dados && (
          <div>
            {/* Seção de Dados Vitais */}
            <section className="vitals-section">
              <h2>📊 Dados Vitais</h2>
              <div className="vitals-grid">
                <div className="vital-card">
                  <p className="vital-label">❤️ Frequência Cardíaca</p>
                  <p className="vital-value">{dados.heart_rate} bpm</p>
                </div>
                <div className="vital-card">
                  <p className="vital-label">👣 Passos (24h)</p>
                  <p className="vital-value">{dados.steps_count}</p>
                </div>
                <div className="vital-card">
                  <p className="vital-label">😴 Horas de Sono</p>
                  <p className="vital-value">{dados.sleep_duration_hours}h</p>
                </div>
              </div>
            </section>

            {/* Seção de Análise de IA */}
            <section className="analysis-section">
              <h2>🤖 Análise de IA</h2>
              <div className="analysis-box">
                <p>{dados.analysis || "Carregando análise..."}</p>
              </div>
            </section>

            {/* Alerta SOS (se necessário) */}
            {dados.sos_alert && (
              <section className="sos-section">
                <h2 style={{ color: "red" }}>🚨 ALERTA SOS ACIONADO!</h2>
                <p>Frequência cardíaca elevada detectada. Por favor, entre em contato com um profissional de saúde.</p>
              </section>
            )}

            {/* Botão SOS */}
            <section className="sos-button-section">
              <button className="sos-button" onClick={handleSOS}>
                🚨 BOTÃO SOS
              </button>
            </section>

            {/* Timestamp */}
            <p className="timestamp">
              ⏰ Última atualização: {new Date(dados.timestamp).toLocaleString("pt-BR")}
            </p>
          </div>
        )}
      </div>

      <style>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 30px;
        }

        h2 {
          color: #555;
          margin-top: 30px;
          margin-bottom: 15px;
          border-bottom: 2px solid #007bff;
          padding-bottom: 10px;
        }

        .vitals-section {
          margin-bottom: 30px;
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .vital-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .vital-label {
          font-size: 14px;
          margin: 0;
          opacity: 0.9;
        }

        .vital-value {
          font-size: 28px;
          font-weight: bold;
          margin: 10px 0 0 0;
        }

        .analysis-section {
          margin-bottom: 30px;
        }

        .analysis-box {
          background: #f8f9fa;
          border-left: 4px solid #007bff;
          padding: 20px;
          border-radius: 5px;
          line-height: 1.6;
          color: #333;
        }

        .sos-section {
          background: #fff3cd;
          border-left: 4px solid #ff6b6b;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .sos-section h2 {
          margin-top: 0;
          border-bottom: none;
        }

        .sos-button-section {
          text-align: center;
          margin: 30px 0;
        }

        .sos-button {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          padding: 15px 40px;
          font-size: 18px;
          font-weight: bold;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .sos-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
        }

        .sos-button:active {
          transform: scale(0.98);
        }

        .timestamp {
          text-align: center;
          color: #999;
          font-size: 12px;
          margin-top: 30px;
        }

        p {
          color: #666;
          line-height: 1.6;
        }
      `}</style>
    </MainLayout>
  );
}
