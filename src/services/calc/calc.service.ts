import { Injectable } from '@nestjs/common';
import { KafkaProducer } from '../kafka';
import { getRandomNumberArray } from '../../common/utils';

@Injectable()
export class CalcService {
  timer: NodeJS.Timeout;

  constructor(private kafkaProducer: KafkaProducer) {
    this.startCalculation();
  }

  private startCalculation() {
    this.timer = setInterval(async () => {
      await this.kafkaProducer.produce('sum', getRandomNumberArray());
    }, 2000);
  }

  private stopCalculation() {
    clearTimeout(this.timer);
  }
}
