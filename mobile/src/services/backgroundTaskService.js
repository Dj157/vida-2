/**
 * Background Task Service
 * Coleta dados de saúde periodicamente mesmo quando o app está fechado
 */

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import healthDataService from './healthDataService';
import apiService from './apiService';

const BACKGROUND_TASK_NAME = 'vida-plus-health-sync';
const SYNC_INTERVAL = 10 * 60; // 10 minutos em segundos

/**
 * Registra a tarefa de background
 */
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    console.log('🔄 Iniciando coleta de dados de saúde em background...');

    // Coleta dados de saúde
    const healthData = await healthDataService.getAllHealthData();

    // Envia dados para o Backend
    await apiService.sendHealthData(healthData);

    console.log('✅ Dados de saúde enviados com sucesso em background');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('❌ Erro durante a tarefa de background:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

class BackgroundTaskService {
  /**
   * Registra a tarefa de background
   */
  static async registerBackgroundTask() {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: SYNC_INTERVAL,
        stopOnTerminate: false,
        startOnBoot: true,
      });

      console.log('✅ Tarefa de background registrada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao registrar tarefa de background:', error);
    }
  }

  /**
   * Desregistra a tarefa de background
   */
  static async unregisterBackgroundTask() {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
      console.log('✅ Tarefa de background desregistrada');
    } catch (error) {
      console.error('❌ Erro ao desregistrar tarefa de background:', error);
    }
  }

  /**
   * Verifica se a tarefa de background está registrada
   */
  static async isTaskRegistered() {
    try {
      const tasks = await TaskManager.getRegisteredTasksAsync();
      return tasks.some((task) => task.taskName === BACKGROUND_TASK_NAME);
    } catch (error) {
      console.error('❌ Erro ao verificar status da tarefa:', error);
      return false;
    }
  }

  /**
   * Inicia a coleta manual de dados (para testes)
   */
  static async manualSync() {
    try {
      console.log('🔄 Iniciando sincronização manual...');
      const healthData = await healthDataService.getAllHealthData();
      await apiService.sendHealthData(healthData);
      console.log('✅ Sincronização manual concluída');
      return true;
    } catch (error) {
      console.error('❌ Erro durante sincronização manual:', error);
      return false;
    }
  }
}

export default BackgroundTaskService;
