/**
 * Notification Service
 * Gerencia alertas multicanal: Push Notifications, Email, WhatsApp/SMS
 */

const nodemailer = require('nodemailer');
const axios = require('axios');

class NotificationService {
  constructor() {
    // Configurar transportador de email (exemplo com Gmail)
    this.emailTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Configurar cliente Twilio para WhatsApp/SMS
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Envia alerta SOS para o cuidador via múltiplos canais
   * @param {Object} sosData - Dados do alerta SOS
   * @param {Object} userData - Dados do usuário
   * @param {Object} caregiverData - Dados do cuidador
   */
  async sendSOSAlert(sosData, userData, caregiverData) {
    try {
      console.log('🚨 Enviando alerta SOS para cuidador...');

      const alertMessage = this.formatAlertMessage(sosData, userData);

      // Enviar via múltiplos canais em paralelo
      const results = await Promise.allSettled([
        this.sendPushNotification(caregiverData, alertMessage),
        this.sendEmail(caregiverData.email, alertMessage, sosData),
        this.sendWhatsApp(caregiverData.phone, alertMessage),
      ]);

      // Log dos resultados
      results.forEach((result, index) => {
        const channel = ['Push', 'Email', 'WhatsApp'][index];
        if (result.status === 'fulfilled') {
          console.log(`✅ ${channel} enviado com sucesso`);
        } else {
          console.error(`❌ Erro ao enviar ${channel}:`, result.reason);
        }
      });

      return {
        success: results.some((r) => r.status === 'fulfilled'),
        details: results,
      };
    } catch (error) {
      console.error('❌ Erro ao enviar alerta SOS:', error);
      throw error;
    }
  }

  /**
   * Envia notificação push via Firebase Cloud Messaging
   * @param {Object} caregiverData - Dados do cuidador
   * @param {string} message - Mensagem de alerta
   */
  async sendPushNotification(caregiverData, message) {
    try {
      // Implementar com Firebase Admin SDK
      // Este é um exemplo simplificado
      console.log('📱 Enviando notificação push...');

      const payload = {
        notification: {
          title: '🚨 ALERTA SOS - Vida+',
          body: message,
          sound: 'default',
          priority: 'high',
        },
        data: {
          action: 'SOS_ALERT',
          timestamp: new Date().toISOString(),
        },
      };

      // TODO: Integrar com Firebase Admin SDK
      // await admin.messaging().send({
      //   token: caregiverData.fcmToken,
      //   ...payload,
      // });

      console.log('✅ Notificação push preparada');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar notificação push:', error);
      throw error;
    }
  }

  /**
   * Envia email com detalhes do alerta
   * @param {string} email - Email do cuidador
   * @param {string} message - Mensagem de alerta
   * @param {Object} sosData - Dados do alerta SOS
   */
  async sendEmail(email, message, sosData) {
    try {
      console.log('📧 Enviando email...');

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; }
              .alert { background-color: #ffebee; padding: 20px; border-radius: 5px; border-left: 4px solid #f44336; }
              .title { color: #f44336; font-size: 24px; font-weight: bold; }
              .details { margin-top: 20px; }
              .detail-row { margin: 10px 0; }
              .label { font-weight: bold; }
              .action { margin-top: 20px; }
              .button { background-color: #f44336; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="alert">
              <div class="title">🚨 ALERTA SOS - Vida+</div>
              <div class="details">
                <div class="detail-row">
                  <span class="label">Mensagem:</span> ${message}
                </div>
                <div class="detail-row">
                  <span class="label">Frequência Cardíaca:</span> ${sosData.heart_rate} bpm
                </div>
                <div class="detail-row">
                  <span class="label">Passos (24h):</span> ${sosData.steps_count}
                </div>
                <div class="detail-row">
                  <span class="label">Sono:</span> ${sosData.sleep_duration_hours} horas
                </div>
                <div class="detail-row">
                  <span class="label">Horário:</span> ${new Date(sosData.timestamp).toLocaleString('pt-BR')}
                </div>
              </div>
              <div class="action">
                <p>Por favor, entre em contato com o usuário ou procure ajuda médica se necessário.</p>
                <a href="https://vida-plus.app" class="button">Abrir Vida+</a>
              </div>
            </div>
          </body>
        </html>
      `;

      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🚨 ALERTA SOS - Vida+',
        html: htmlContent,
      });

      console.log('✅ Email enviado com sucesso');
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw error;
    }
  }

  /**
   * Envia mensagem WhatsApp via Twilio
   * @param {string} phoneNumber - Número de telefone do cuidador
   * @param {string} message - Mensagem de alerta
   */
  async sendWhatsApp(phoneNumber, message) {
    try {
      console.log('💬 Enviando WhatsApp...');

      // Formatar número de telefone para o padrão Twilio (+55...)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`;

      const data = new URLSearchParams();
      data.append('From', `whatsapp:${this.twilioPhoneNumber}`);
      data.append('To', `whatsapp:${formattedPhone}`);
      data.append('Body', `🚨 ALERTA SOS - Vida+\n\n${message}\n\nPor favor, entre em contato com o usuário ou procure ajuda médica.`);

      const response = await axios.post(url, data, {
        auth: {
          username: this.twilioAccountSid,
          password: this.twilioAuthToken,
        },
      });

      console.log('✅ WhatsApp enviado com sucesso');
      return { success: true, messageId: response.data.sid };
    } catch (error) {
      console.error('❌ Erro ao enviar WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Envia SMS via Twilio (fallback para WhatsApp)
   * @param {string} phoneNumber - Número de telefone do cuidador
   * @param {string} message - Mensagem de alerta
   */
  async sendSMS(phoneNumber, message) {
    try {
      console.log('📞 Enviando SMS...');

      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`;

      const data = new URLSearchParams();
      data.append('From', this.twilioPhoneNumber);
      data.append('To', formattedPhone);
      data.append('Body', `🚨 ALERTA SOS - Vida+: ${message}`);

      const response = await axios.post(url, data, {
        auth: {
          username: this.twilioAccountSid,
          password: this.twilioAuthToken,
        },
      });

      console.log('✅ SMS enviado com sucesso');
      return { success: true, messageId: response.data.sid };
    } catch (error) {
      console.error('❌ Erro ao enviar SMS:', error);
      throw error;
    }
  }

  /**
   * Formata a mensagem de alerta
   * @param {Object} sosData - Dados do alerta SOS
   * @param {Object} userData - Dados do usuário
   * @returns {string} Mensagem formatada
   */
  formatAlertMessage(sosData, userData) {
    return `
Usuário: ${userData.name}
Frequência Cardíaca: ${sosData.heart_rate} bpm
Passos (24h): ${sosData.steps_count}
Sono: ${sosData.sleep_duration_hours} horas
Análise: ${sosData.analysis}
Horário: ${new Date(sosData.timestamp).toLocaleString('pt-BR')}
    `.trim();
  }

  /**
   * Formata número de telefone para o padrão Twilio
   * @param {string} phoneNumber - Número de telefone
   * @returns {string} Número formatado
   */
  formatPhoneNumber(phoneNumber) {
    // Remove caracteres especiais
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Se não começar com +, adiciona +55 (Brasil)
    if (!cleaned.startsWith('55')) {
      return `+55${cleaned}`;
    }

    return `+${cleaned}`;
  }
}

module.exports = new NotificationService();
