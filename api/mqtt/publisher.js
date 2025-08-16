import mqtt from 'mqtt';
import { v4 as uuidv4 } from 'uuid';
import { appendHistory, updateHistoryStatus } from '../state';

class MQTTPublisher {
  constructor() {
    this.client = mqtt.connect('mqtt://localhost');
    
    this.client.on('connect', () => {
      this.client.subscribe('matrix/ack');
    });
    
    this.client.on('message', (topic, message) => {
      if (topic === 'matrix/ack') this._handleAck(message);
    });
  }

  /**
   * Публикация данных
   * @param {Object} data - Данные для матрицы
   * @param {Object} [meta] - Доп. метаданные
   */
  async publish(data, meta = {}) {
    const messageId = uuidv4();
    const payload = {
      id: messageId,
      data,
      meta,
      publishedAt: new Date(),
      status: 'pending'
    };

    appendHistory(payload);
    this.client.publish(
      'matrix/updates',
      JSON.stringify(payload),
      { qos: 1, retain: true },
      (err) => {
        if (err) {
          updateHistoryStatus(messageId, "error")
        } else {
          updateHistoryStatus(messageId, "published")
        }
      }
    );

    return messageId;
  }

  async _handleAck(message) {
    try {
      const { messageId, receivedAt } = JSON.parse(message.toString());
      updateHistoryStatus(messageId, "delivered")
    } catch (e) {
      console.error('[MQTT] Ack processing error:', e);
    }
  }
}

const publisher = new MQTTPublisher();
export default publisher;