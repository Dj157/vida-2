/**
 * Secure Storage Service
 * Armazenamento seguro de dados sensíveis no dispositivo mobile
 * Usa AsyncStorage com criptografia local
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import crypto from 'crypto-js';

class SecureStorageService {
  constructor() {
    this.encryptionKey = 'vida-plus-secure-key'; // Em produção, usar uma chave mais robusta
  }

  /**
   * Armazena dados sensíveis de forma segura
   * @param {string} key - Chave de armazenamento
   * @param {any} value - Valor a ser armazenado
   */
  async setSecureData(key, value) {
    try {
      // Para dados muito sensíveis, usar SecureStore (mais seguro)
      if (key.includes('token') || key.includes('password')) {
        await SecureStore.setItemAsync(key, JSON.stringify(value));
      } else {
        // Para outros dados, usar AsyncStorage com criptografia
        const encrypted = this.encryptData(value);
        await AsyncStorage.setItem(key, JSON.stringify(encrypted));
      }
      console.log(`✅ Dados armazenados com segurança: ${key}`);
    } catch (error) {
      console.error(`❌ Erro ao armazenar dados: ${key}`, error);
      throw error;
    }
  }

  /**
   * Recupera dados sensíveis de forma segura
   * @param {string} key - Chave de armazenamento
   * @returns {Promise<any>} Valor descriptografado
   */
  async getSecureData(key) {
    try {
      // Para dados muito sensíveis, usar SecureStore
      if (key.includes('token') || key.includes('password')) {
        const value = await SecureStore.getItemAsync(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Para outros dados, usar AsyncStorage com descriptografia
        const encrypted = await AsyncStorage.getItem(key);
        if (!encrypted) return null;
        return this.decryptData(JSON.parse(encrypted));
      }
    } catch (error) {
      console.error(`❌ Erro ao recuperar dados: ${key}`, error);
      return null;
    }
  }

  /**
   * Remove dados armazenados
   * @param {string} key - Chave de armazenamento
   */
  async removeSecureData(key) {
    try {
      if (key.includes('token') || key.includes('password')) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
      console.log(`✅ Dados removidos: ${key}`);
    } catch (error) {
      console.error(`❌ Erro ao remover dados: ${key}`, error);
      throw error;
    }
  }

  /**
   * Limpa todos os dados armazenados
   */
  async clearAllData() {
    try {
      await AsyncStorage.clear();
      console.log('✅ Todos os dados foram limpos');
    } catch (error) {
      console.error('❌ Erro ao limpar dados:', error);
      throw error;
    }
  }

  /**
   * Criptografa um valor usando AES
   * @param {any} value - Valor a ser criptografado
   * @returns {Object} Objeto com dados criptografados
   */
  encryptData(value) {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = crypto.AES.encrypt(jsonString, this.encryptionKey).toString();
      return {
        encrypted: true,
        data: encrypted,
      };
    } catch (error) {
      console.error('❌ Erro ao criptografar dados:', error);
      throw error;
    }
  }

  /**
   * Descriptografa um valor criptografado
   * @param {Object} encryptedObj - Objeto com dados criptografados
   * @returns {any} Valor descriptografado
   */
  decryptData(encryptedObj) {
    try {
      if (!encryptedObj.encrypted) {
        return encryptedObj;
      }

      const decrypted = crypto.AES.decrypt(encryptedObj.data, this.encryptionKey).toString(crypto.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('❌ Erro ao descriptografar dados:', error);
      throw error;
    }
  }

  /**
   * Armazena dados de saúde de forma segura
   * @param {Object} healthData - Dados de saúde
   */
  async saveHealthData(healthData) {
    try {
      const key = `health_data_${new Date().toISOString().split('T')[0]}`;
      await this.setSecureData(key, healthData);
      console.log('✅ Dados de saúde armazenados com segurança');
    } catch (error) {
      console.error('❌ Erro ao armazenar dados de saúde:', error);
      throw error;
    }
  }

  /**
   * Recupera dados de saúde do dia
   * @returns {Promise<Object>} Dados de saúde
   */
  async getTodayHealthData() {
    try {
      const key = `health_data_${new Date().toISOString().split('T')[0]}`;
      const data = await this.getSecureData(key);
      return data || null;
    } catch (error) {
      console.error('❌ Erro ao recuperar dados de saúde:', error);
      return null;
    }
  }

  /**
   * Armazena token de autenticação
   * @param {string} token - Token JWT
   */
  async saveAuthToken(token) {
    try {
      await this.setSecureData('auth_token', token);
      console.log('✅ Token de autenticação armazenado com segurança');
    } catch (error) {
      console.error('❌ Erro ao armazenar token:', error);
      throw error;
    }
  }

  /**
   * Recupera token de autenticação
   * @returns {Promise<string>} Token JWT
   */
  async getAuthToken() {
    try {
      const token = await this.getSecureData('auth_token');
      return token || null;
    } catch (error) {
      console.error('❌ Erro ao recuperar token:', error);
      return null;
    }
  }

  /**
   * Remove token de autenticação (logout)
   */
  async clearAuthToken() {
    try {
      await this.removeSecureData('auth_token');
      console.log('✅ Token de autenticação removido');
    } catch (error) {
      console.error('❌ Erro ao remover token:', error);
      throw error;
    }
  }

  /**
   * Armazena preferências do usuário
   * @param {Object} preferences - Preferências
   */
  async saveUserPreferences(preferences) {
    try {
      await this.setSecureData('user_preferences', preferences);
      console.log('✅ Preferências do usuário armazenadas');
    } catch (error) {
      console.error('❌ Erro ao armazenar preferências:', error);
      throw error;
    }
  }

  /**
   * Recupera preferências do usuário
   * @returns {Promise<Object>} Preferências
   */
  async getUserPreferences() {
    try {
      const prefs = await this.getSecureData('user_preferences');
      return prefs || {};
    } catch (error) {
      console.error('❌ Erro ao recuperar preferências:', error);
      return {};
    }
  }
}

export default new SecureStorageService();
