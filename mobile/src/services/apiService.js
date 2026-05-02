/**
 * API Service
 * Comunicação com o Backend para envio de dados de saúde e recebimento de análises
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Envia dados de saúde para o Backend
   * @param {Object} healthData - Dados de saúde coletados
   * @returns {Promise<Object>} Resposta do Backend com análise da IA
   */
  async sendHealthData(healthData) {
    try {
      console.log('📤 Enviando dados de saúde para o Backend...', healthData);

      const response = await this.client.post('/api/vitals', {
        heart_rate: healthData.heartRate,
        steps_count: healthData.steps,
        sleep_duration_hours: healthData.sleepDuration,
        user_id: 'user_' + this.getUserId(), // ID único do usuário
        timestamp: healthData.timestamp,
      });

      console.log('✅ Dados enviados com sucesso. Resposta:', response.data);

      // Se houver alerta SOS, dispara notificação
      if (response.data.sos_alert) {
        console.warn('🚨 ALERTA SOS RECEBIDO DO BACKEND!');
        this.handleSOSAlert(response.data);
      }

      return response.data;
    } catch (error) {
      console.error('❌ Erro ao enviar dados de saúde:', error.message);
      throw error;
    }
  }

  /**
   * Obtém a análise mais recente do Backend
   * @returns {Promise<Object>} Análise da IA
   */
  async getLatestAnalysis() {
    try {
      console.log('📥 Buscando análise mais recente...');

      const response = await this.client.get('/api/vitals', {
        params: {
          user_id: 'user_' + this.getUserId(),
        },
      });

      console.log('✅ Análise recebida:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar análise:', error.message);
      throw error;
    }
  }

  /**
   * Dispara um alerta SOS manualmente
   * @returns {Promise<Object>} Resposta do Backend
   */
  async triggerSOS() {
    try {
      console.log('🚨 Disparando SOS manualmente...');

      const response = await this.client.post('/api/sos', {
        user_id: 'user_' + this.getUserId(),
        timestamp: new Date().toISOString(),
        reason: 'Manual SOS triggered by user',
      });

      console.log('✅ SOS disparado com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao disparar SOS:', error.message);
      throw error;
    }
  }

  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} Resposta do Backend
   */
  async registerUser(userData) {
    try {
      console.log('📝 Registrando novo usuário...');

      const response = await this.client.post('/api/users', {
        name: userData.name,
        age: userData.age,
        email: userData.email,
        phone: userData.phone,
        caregiver_contact: userData.caregiverContact,
      });

      console.log('✅ Usuário registrado com sucesso:', response.data);
      this.setUserId(response.data.user_id);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao registrar usuário:', error.message);
      throw error;
    }
  }

  /**
   * Obtém o ID do usuário armazenado localmente
   * @returns {string} ID do usuário
   */
  getUserId() {
    // Em produção, isso seria armazenado de forma segura (ex: AsyncStorage)
    return global.userId || 'default_user';
  }

  /**
   * Define o ID do usuário
   * @param {string} userId - ID do usuário
   */
  setUserId(userId) {
    global.userId = userId;
  }

  /**
   * Trata alertas SOS recebidos do Backend
   * @param {Object} sosData - Dados do alerta SOS
   */
  handleSOSAlert(sosData) {
    // Aqui seria disparada uma notificação push ou local
    console.warn('🚨 Tratando SOS Alert:', sosData);
    // TODO: Integrar com serviço de notificações push
  }
}

export default new APIService();
