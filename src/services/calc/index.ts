import { Module } from '@nestjs/common';
import { CalcService } from './calc.service';
import { KafkaModule } from '../kafka';

@Module({
  imports: [KafkaModule],
  providers: [CalcService],
})
export class CalcModule {}
