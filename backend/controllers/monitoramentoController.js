const axios = require('axios');

// URL do serviço de IA (FastAPI)
const AI_SERVICE_URL = 'http://localhost:8001/analyze_vitals';

const getMonitoramento = async (req, res) => {
  // Dados simulados para teste (substituir pela leitura real do smartwatch)
  const dadosSimulados = {
    heart_rate: 105, // Exemplo de batimento alto
    sleep_duration_hours: 5.5,
    steps_count: 800,
    user_id: "idoso_001"
  };

  try {
    // 1. Enviar dados para o serviço de IA
    const aiResponse = await axios.post(AI_SERVICE_URL, dadosSimulados);
    const { analysis, sos_alert } = aiResponse.data;

    // 2. Lógica de Automação (SOS e Alertas)
    if (sos_alert) {
      console.log("!!! ALERTA SOS ACIONADO !!!");
      // Aqui entraria a lógica para enviar e-mail/WhatsApp para o cuidador
      // Por enquanto, apenas logamos.
    }

    // 3. Retornar os dados e a análise da IA para o Frontend
    const dadosFinais = {
      ...dadosSimulados,
      analysis: analysis,
      sos_alert: sos_alert,
      timestamp: new Date().toISOString()
    };

    res.status(200).json(dadosFinais);

  } catch (error) {
    console.error("Erro ao integrar com o serviço de IA:", error.message);
    // Retorna um erro amigável caso o serviço de IA não esteja rodando
    res.status(500).json({
      error: "Erro ao processar a análise de IA. Verifique se o serviço de IA está ativo (porta 8001).",
      details: error.message
    });
  }
};

module.exports = {
  getMonitoramento,
};
