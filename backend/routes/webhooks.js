/**
 * Webhook Routes
 * Endpoints para disparar eventos e alertas
 */

const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

/**
 * POST /webhooks/sos
 * Dispara um alerta SOS
 */
router.post('/sos', async (req, res) => {
  try {
    const { user_id, heart_rate, steps_count, sleep_duration_hours, analysis, timestamp } = req.body;

    console.log('🚨 Webhook SOS recebido:', { user_id, heart_rate, steps_count });

    // Buscar dados do usuário e cuidador no banco de dados
    // TODO: Implementar busca no banco de dados
    const userData = {
      name: 'Usuário Teste',
      email: 'usuario@example.com',
    };

    const caregiverData = {
      name: 'Cuidador Teste',
      email: process.env.CAREGIVER_EMAIL || 'cuidador@example.com',
      phone: process.env.CAREGIVER_PHONE || '+5511999999999',
      fcmToken: 'token_firebase_exemplo', // Token para notificação push
    };

    // Enviar alertas via múltiplos canais
    const sosData = {
      user_id,
      heart_rate,
      steps_count,
      sleep_duration_hours,
      analysis,
      timestamp,
    };

    const result = await notificationService.sendSOSAlert(sosData, userData, caregiverData);

    res.status(200).json({
      success: true,
      message: 'Alerta SOS enviado com sucesso',
      details: result,
    });
  } catch (error) {
    console.error('❌ Erro no webhook SOS:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /webhooks/health-check
 * Verifica o status de saúde do usuário
 */
router.post('/health-check', async (req, res) => {
  try {
    const { user_id, heart_rate, steps_count, sleep_duration_hours } = req.body;

    console.log('📊 Health Check recebido:', { user_id, heart_rate, steps_count });

    // Lógica para determinar se um alerta deve ser disparado
    const shouldAlert = heart_rate > 120 || steps_count < 500 || sleep_duration_hours < 4;

    if (shouldAlert) {
      console.log('⚠️ Condições de alerta detectadas');
      // Disparar alerta
      // TODO: Integrar com notificationService
    }

    res.status(200).json({
      success: true,
      shouldAlert,
      message: 'Health check processado',
    });
  } catch (error) {
    console.error('❌ Erro no webhook health-check:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /webhooks/ai-analysis
 * Recebe análise da IA e dispara alertas se necessário
 */
router.post('/ai-analysis', async (req, res) => {
  try {
    const { user_id, analysis, sos_alert, vitals } = req.body;

    console.log('🤖 Análise de IA recebida:', { user_id, sos_alert });

    if (sos_alert) {
      console.log('🚨 Alerta SOS disparado pela IA');

      // Buscar dados do usuário e cuidador
      // TODO: Implementar busca no banco de dados
      const userData = {
        name: 'Usuário Teste',
        email: 'usuario@example.com',
      };

      const caregiverData = {
        name: 'Cuidador Teste',
        email: process.env.CAREGIVER_EMAIL || 'cuidador@example.com',
        phone: process.env.CAREGIVER_PHONE || '+5511999999999',
      };

      const sosData = {
        user_id,
        ...vitals,
        analysis,
        timestamp: new Date().toISOString(),
      };

      await notificationService.sendSOSAlert(sosData, userData, caregiverData);
    }

    res.status(200).json({
      success: true,
      message: 'Análise processada',
      sosAlert: sos_alert,
    });
  } catch (error) {
    console.error('❌ Erro no webhook ai-analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
