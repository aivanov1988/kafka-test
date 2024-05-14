import { Injectable } from '@nestjs/common';
import { Kafka, KafkaJSConnectionError, KafkaJSError, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducer {
  private producer: Producer = null;

  async connect() {
    try {
      if (this.producer !== null) {
        await this.disconnect();
      }
      const kafka = new Kafka({
        clientId: 'producer',
        brokers: ['127.0.0.1:9092'],
        retry: {
          retries: 0,
        },
      });
      this.producer = kafka.producer();
      await this.producer.connect();
    } catch (error) {
      if (
        error instanceof KafkaJSError ||
        error instanceof KafkaJSConnectionError
      ) {
        this.producer = null;
      }
    }
  }

  async produce(topic: string, data: object) {
    try {
      if (this.producer === null) {
        await this.connect();
      }
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(data) }],
      });
    } catch (error) {
      if (
        error instanceof KafkaJSError ||
        error instanceof KafkaJSConnectionError
      ) {
        return;
      }
    }
  }

  async disconnect() {
    if (this.producer === null) {
      return;
    }
    await this.producer.disconnect();
    this.producer = null;
  }
}
