import { Module } from '@nestjs/common';
import { KafkaConsumer } from './kafka.consumer';
import { KafkaProducer } from './kafka.producer';

export * from './kafka.consumer';
export * from './kafka.producer';

@Module({
  providers: [KafkaConsumer, KafkaProducer],
  exports: [KafkaConsumer, KafkaProducer],
})
export class KafkaModule {}
