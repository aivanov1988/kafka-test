import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeEntity } from './home.entity';
import { KafkaModule } from 'src/services/kafka';

@Module({
  imports: [KafkaModule],
  providers: [HomeEntity],
  controllers: [HomeController],
})
export class HomeModule {}
