/**
 * Health Data Service
 * Integração com Apple HealthKit (iOS) e Google Fit (Android)
 * Coleta dados de saúde do smartwatch via sincronização com o celular
 */

import AppleHealthKit from 'react-native-health';
import GoogleFit, { Scopes } from 'react-native-google-fit';
import { Platform } from 'react-native';

class HealthDataService {
  constructor() {
    this.isInitialized = false;
    this.healthData = {
      heartRate: null,
      steps: null,
      sleepDuration: null,
      timestamp: null,
    };
  }

  /**
   * Inicializa o serviço de saúde baseado na plataforma
   */
  async initialize() {
    try {
      if (Platform.OS === 'ios') {
        await this.initializeAppleHealth();
      } else if (Platform.OS === 'android') {
        await this.initializeGoogleFit();
      }
      this.isInitialized = true;
      console.log('✅ Health Data Service inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar Health Data Service:', error);
      throw error;
    }
  }

  /**
   * Inicializa Apple HealthKit (iOS)
   */
  async initializeAppleHealth() {
    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.StepCount,
          AppleHealthKit.Constants.Permissions.SleepAnalysis,
        ],
      },
    };

    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.error('❌ Erro ao inicializar Apple HealthKit:', error);
          reject(error);
        } else {
          console.log('✅ Apple HealthKit inicializado');
          resolve();
        }
      });
    });
  }

  /**
   * Inicializa Google Fit (Android)
   */
  async initializeGoogleFit() {
    try {
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_HEART_RATE_READ,
          Scopes.FITNESS_SLEEP_READ,
        ],
      };

      await GoogleFit.authorize(options);
      console.log('✅ Google Fit inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar Google Fit:', error);
      throw error;
    }
  }

  /**
   * Coleta dados de frequência cardíaca
   */
  async getHeartRate() {
    try {
      if (Platform.OS === 'ios') {
        return await this.getHeartRateIOS();
      } else if (Platform.OS === 'android') {
        return await this.getHeartRateAndroid();
      }
    } catch (error) {
      console.error('❌ Erro ao coletar frequência cardíaca:', error);
      return null;
    }
  }

  /**
   * Coleta frequência cardíaca no iOS
   */
  getHeartRateIOS() {
    return new Promise((resolve, reject) => {
      const options = {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
        endDate: new Date(),
        ascending: false,
        limit: 1, // Pega o mais recente
      };

      AppleHealthKit.getHeartRateSamples(options, (error, results) => {
        if (error) {
          console.error('Erro ao buscar frequência cardíaca (iOS):', error);
          reject(error);
        } else {
          const latestHeartRate = results.length > 0 ? results[0].value : null;
          resolve(latestHeartRate);
        }
      });
    });
  }

  /**
   * Coleta frequência cardíaca no Android
   */
  async getHeartRateAndroid() {
    try {
      const options = {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(),
        endDate: new Date().getTime(),
        bucketUnit: GoogleFit.BucketUnit.MINUTE,
        bucketInterval: 1,
      };

      const result = await GoogleFit.getHeartRateSamples(options);
      if (result && result.length > 0) {
        return result[result.length - 1].value;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar frequência cardíaca (Android):', error);
      return null;
    }
  }

  /**
   * Coleta dados de passos
   */
  async getSteps() {
    try {
      if (Platform.OS === 'ios') {
        return await this.getStepsIOS();
      } else if (Platform.OS === 'android') {
        return await this.getStepsAndroid();
      }
    } catch (error) {
      console.error('❌ Erro ao coletar passos:', error);
      return null;
    }
  }

  /**
   * Coleta passos no iOS
   */
  getStepsIOS() {
    return new Promise((resolve, reject) => {
      const options = {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
        endDate: new Date(),
      };

      AppleHealthKit.getStepCount(options, (error, results) => {
        if (error) {
          console.error('Erro ao buscar passos (iOS):', error);
          reject(error);
        } else {
          const totalSteps = results.value || 0;
          resolve(totalSteps);
        }
      });
    });
  }

  /**
   * Coleta passos no Android
   */
  async getStepsAndroid() {
    try {
      const options = {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(),
        endDate: new Date().getTime(),
        bucketUnit: GoogleFit.BucketUnit.DAY,
        bucketInterval: 1,
      };

      const result = await GoogleFit.getDailyStepCountSamples(options);
      if (result && result.length > 0) {
        return result[0].steps[0].value;
      }
      return 0;
    } catch (error) {
      console.error('Erro ao buscar passos (Android):', error);
      return 0;
    }
  }

  /**
   * Coleta dados de sono
   */
  async getSleepData() {
    try {
      if (Platform.OS === 'ios') {
        return await this.getSleepDataIOS();
      } else if (Platform.OS === 'android') {
        return await this.getSleepDataAndroid();
      }
    } catch (error) {
      console.error('❌ Erro ao coletar dados de sono:', error);
      return null;
    }
  }

  /**
   * Coleta dados de sono no iOS
   */
  getSleepDataIOS() {
    return new Promise((resolve, reject) => {
      const options = {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
        endDate: new Date(),
      };

      AppleHealthKit.getSleepSamples(options, (error, results) => {
        if (error) {
          console.error('Erro ao buscar sono (iOS):', error);
          reject(error);
        } else {
          let totalSleepMinutes = 0;
          if (results && results.length > 0) {
            results.forEach((sample) => {
              const duration = (sample.endDate - sample.startDate) / (1000 * 60); // Converte para minutos
              totalSleepMinutes += duration;
            });
          }
          const sleepHours = (totalSleepMinutes / 60).toFixed(1);
          resolve(parseFloat(sleepHours));
        }
      });
    });
  }

  /**
   * Coleta dados de sono no Android
   */
  async getSleepDataAndroid() {
    try {
      const options = {
        startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(),
        endDate: new Date().getTime(),
        bucketUnit: GoogleFit.BucketUnit.DAY,
        bucketInterval: 1,
      };

      const result = await GoogleFit.getSleepSamples(options);
      if (result && result.length > 0) {
        const sleepMinutes = result[0].duration || 0;
        const sleepHours = (sleepMinutes / 60).toFixed(1);
        return parseFloat(sleepHours);
      }
      return 0;
    } catch (error) {
      console.error('Erro ao buscar sono (Android):', error);
      return 0;
    }
  }

  /**
   * Coleta todos os dados de saúde de uma vez
   */
  async getAllHealthData() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const [heartRate, steps, sleepDuration] = await Promise.all([
        this.getHeartRate(),
        this.getSteps(),
        this.getSleepData(),
      ]);

      this.healthData = {
        heartRate: heartRate || 0,
        steps: steps || 0,
        sleepDuration: sleepDuration || 0,
        timestamp: new Date().toISOString(),
      };

      console.log('📊 Dados de saúde coletados:', this.healthData);
      return this.healthData;
    } catch (error) {
      console.error('❌ Erro ao coletar todos os dados de saúde:', error);
      throw error;
    }
  }

  /**
   * Retorna os últimos dados coletados
   */
  getLastHealthData() {
    return this.healthData;
  }
}

export default new HealthDataService();
