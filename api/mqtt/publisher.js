import mqtt from 'mqtt';
import { v4 as uuidv4 } from 'uuid';
import { appendHistory, updateHistoryStatus } from '../state.js';

class MQTTPublisher {
  constructor() {
    this.connectionStatus = 'disconnected';
    this.connectionListeners = [];
    
    this.client = mqtt.connect('mqtt://localhost', {
      clientId: `matrix-publisher-${uuidv4()}`,
      reconnectPeriod: 5000 // 5 sec reconnect interval
    });

    this._setupEventHandlers();
  }

  _setupEventHandlers() {
    this.client.on('connect', () => {
      this.connectionStatus = 'connected';
      this._notifyConnectionChange();
      console.log('[MQTT] Connected to broker');
      this.client.subscribe('matrix/ack');
    });

    this.client.on('reconnect', () => {
      this.connectionStatus = 'reconnecting';
      this._notifyConnectionChange();
      console.log('[MQTT] Reconnecting...');
    });

    this.client.on('close', () => {
      this.connectionStatus = 'disconnected';
      this._notifyConnectionChange();
      console.log('[MQTT] Disconnected');
    });

    this.client.on('error', (err) => {
      this.connectionStatus = 'error';
      this._notifyConnectionChange();
      console.error('[MQTT] Connection error:', err);
    });

    this.client.on('message', (topic, message) => {
      if (topic === 'matrix/ack') this._handleAck(message);
    });
  }

  _notifyConnectionChange() {
    this.connectionListeners.forEach(cb => cb(this.connectionStatus));
  }

  /**
   * Добавляет слушателя изменений статуса подключения
   * @param {Function} callback - (status) => {}
   * @returns {Function} Функция для отмены подписки
   */
  onConnectionChange(callback) {
    this.connectionListeners.push(callback);
    // Вызываем сразу текущий статус
    callback(this.connectionStatus);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Публикация данных
   * @param {Object} data - Данные для матрицы
   * @param {Object} [meta] - Доп. метаданные
   * @throws {Error} Если нет подключения к брокеру
   */
  async publish(data, meta = {}) {
    if (this.connectionStatus !== 'connected') {
      throw new Error('Not connected to MQTT broker');
    }

    const messageId = uuidv4();
    const payload = {
      id: messageId,
      data,
      meta,
      publishedAt: new Date(),
      status: 'pending'
    };

    appendHistory(payload);
    
    return new Promise((resolve, reject) => {
      this.client.publish(
        'matrix/updates',
        JSON.stringify(payload),
        { qos: 1, retain: true },
        (err) => {
          if (err) {
            updateHistoryStatus(messageId, "error");
            reject(err);
          } else {
            updateHistoryStatus(messageId, "published");
            resolve(messageId);
          }
        }
      );
    });
  }

  async _handleAck(message) {
    try {
      const { messageId, receivedAt } = JSON.parse(message.toString());
      updateHistoryStatus(messageId, "delivered");
    } catch (e) {
      console.error('[MQTT] Ack processing error:', e);
    }
  }

  /**
   * Закрывает подключение
   */
  disconnect() {
    this.client.end();
  }
}

const publisher = new MQTTPublisher();
export default publisher;