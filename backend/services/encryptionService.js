/**
 * Encryption Service
 * Criptografia de dados sensíveis de saúde em repouso e em trânsito
 * Conformidade com LGPD e boas práticas de segurança
 */

const crypto = require('crypto');

class EncryptionService {
  constructor() {
    // Chave de criptografia (deve ser armazenada em variável de ambiente)
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateKey();
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Gera uma chave de criptografia aleatória
   * @returns {string} Chave em formato hexadecimal
   */
  generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Criptografa um valor sensível
   * @param {string} plaintext - Texto a ser criptografado
   * @returns {Object} Objeto com iv, encryptedData e authTag
   */
  encrypt(plaintext) {
    try {
      const iv = crypto.randomBytes(16);
      const key = Buffer.from(this.encryptionKey, 'hex');
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex'),
      };
    } catch (error) {
      console.error('❌ Erro ao criptografar:', error);
      throw error;
    }
  }

  /**
   * Descriptografa um valor criptografado
   * @param {Object} encryptedObj - Objeto com iv, encryptedData e authTag
   * @returns {string} Texto descriptografado
   */
  decrypt(encryptedObj) {
    try {
      const key = Buffer.from(this.encryptionKey, 'hex');
      const iv = Buffer.from(encryptedObj.iv, 'hex');
      const authTag = Buffer.from(encryptedObj.authTag, 'hex');

      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('❌ Erro ao descriptografar:', error);
      throw error;
    }
  }

  /**
   * Criptografa um objeto inteiro (ex: dados de saúde)
   * @param {Object} data - Objeto a ser criptografado
   * @returns {Object} Objeto criptografado
   */
  encryptObject(data) {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = this.encrypt(jsonString);
      return encrypted;
    } catch (error) {
      console.error('❌ Erro ao criptografar objeto:', error);
      throw error;
    }
  }

  /**
   * Descriptografa um objeto inteiro
   * @param {Object} encryptedObj - Objeto criptografado
   * @returns {Object} Objeto descriptografado
   */
  decryptObject(encryptedObj) {
    try {
      const jsonString = this.decrypt(encryptedObj);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('❌ Erro ao descriptografar objeto:', error);
      throw error;
    }
  }

  /**
   * Gera um hash SHA-256 para um valor (não reversível)
   * Útil para armazenar dados que não precisam ser recuperados
   * @param {string} value - Valor a ser hasheado
   * @returns {string} Hash em formato hexadecimal
   */
  hash(value) {
    try {
      return crypto.createHash('sha256').update(value).digest('hex');
    } catch (error) {
      console.error('❌ Erro ao gerar hash:', error);
      throw error;
    }
  }

  /**
   * Valida um hash SHA-256
   * @param {string} value - Valor original
   * @param {string} hash - Hash a ser validado
   * @returns {boolean} True se o hash é válido
   */
  validateHash(value, hash) {
    try {
      const computedHash = this.hash(value);
      return computedHash === hash;
    } catch (error) {
      console.error('❌ Erro ao validar hash:', error);
      return false;
    }
  }

  /**
   * Anonimiza um email removendo informações identificáveis
   * @param {string} email - Email a ser anonimizado
   * @returns {string} Email anonimizado
   */
  anonymizeEmail(email) {
    try {
      const [localPart, domain] = email.split('@');
      const firstChar = localPart.charAt(0);
      const lastChar = localPart.charAt(localPart.length - 1);
      const anonymized = `${firstChar}***${lastChar}@${domain}`;
      return anonymized;
    } catch (error) {
      console.error('❌ Erro ao anonimizar email:', error);
      return '***@***.***';
    }
  }

  /**
   * Anonimiza um número de telefone
   * @param {string} phone - Telefone a ser anonimizado
   * @returns {string} Telefone anonimizado
   */
  anonymizePhone(phone) {
    try {
      const cleaned = phone.replace(/\D/g, '');
      const lastFour = cleaned.slice(-4);
      return `****${lastFour}`;
    } catch (error) {
      console.error('❌ Erro ao anonimizar telefone:', error);
      return '****';
    }
  }

  /**
   * Criptografa dados de saúde sensíveis antes de armazenar no banco
   * @param {Object} healthData - Dados de saúde
   * @returns {Object} Dados com campos sensíveis criptografados
   */
  encryptHealthData(healthData) {
    try {
      return {
        ...healthData,
        heart_rate_encrypted: this.encrypt(healthData.heart_rate.toString()),
        steps_count_encrypted: this.encrypt(healthData.steps_count.toString()),
        sleep_duration_encrypted: this.encrypt(healthData.sleep_duration_hours.toString()),
      };
    } catch (error) {
      console.error('❌ Erro ao criptografar dados de saúde:', error);
      throw error;
    }
  }

  /**
   * Descriptografa dados de saúde
   * @param {Object} encryptedHealthData - Dados criptografados
   * @returns {Object} Dados descriptografados
   */
  decryptHealthData(encryptedHealthData) {
    try {
      return {
        ...encryptedHealthData,
        heart_rate: parseInt(this.decrypt(encryptedHealthData.heart_rate_encrypted)),
        steps_count: parseInt(this.decrypt(encryptedHealthData.steps_count_encrypted)),
        sleep_duration_hours: parseFloat(this.decrypt(encryptedHealthData.sleep_duration_encrypted)),
      };
    } catch (error) {
      console.error('❌ Erro ao descriptografar dados de saúde:', error);
      throw error;
    }
  }
}

module.exports = new EncryptionService();
