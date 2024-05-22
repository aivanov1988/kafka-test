import { Injectable } from '@nestjs/common';
import {
  Consumer,
  Kafka,
  KafkaJSConnectionError,
  KafkaJSError,
  KafkaJSProtocolError,
  KafkaMessage,
} from 'kafkajs';
import fromKafkaTopic from '../../common/third.party/rxjs-kafka';
import { map } from 'rxjs';

@Injectable()
export class KafkaConsumer {
  private consumer: Consumer = null;

  subscribeToTopic(
    topic: string,
    group: string,
    processFunc: (data: any) => string,
  ) {
    const { message$ } = fromKafkaTopic(
      {
        clientId: 'sse-consumer',
        brokers: ['127.0.0.1:9092'],
        retry: {
          retries: 0,
        },
      },
      { topic },
      { groupId: group },
    );
    return message$.pipe(map(processFunc));
  }

  async connect(group: string) {
    try {
      const kafka = new Kafka({
        clientId: 'consumer',
        brokers: ['127.0.0.1:9092'],
        retry: {
          retries: 0,
        },
      });
      this.consumer = kafka.consumer({ groupId: group });
      await this.consumer.connect();
    } catch (error) {
      if (
        error instanceof KafkaJSError ||
        error instanceof KafkaJSConnectionError ||
        error instanceof KafkaJSProtocolError
      ) {
        await this.disconnect();
        return;
      }
    }
  }

  async tryConsume(
    topic: string,
    group: string,
    processFunc: (data: KafkaMessage) => void,
  ) {
    if (this.consumer === null)
      try {
        await this.connect(group);
        await this.consumer?.subscribe({
          topics: [topic],
          fromBeginning: true,
        });
        await this.consumer?.run({
          autoCommit: false,
          eachMessage: ({ message }) =>
            new Promise((resolve) => {
              processFunc(message);
              resolve();
            }),
        });
      } catch (error) {
        if (
          error instanceof KafkaJSError ||
          error instanceof KafkaJSConnectionError ||
          error instanceof KafkaJSProtocolError
        ) {
          await this.disconnect();
          return;
        }
      }
  }

  async disconnect() {
    if (this.consumer === null) {
      return;
    }
    await this.consumer.disconnect();
    this.consumer = null;
  }
}
