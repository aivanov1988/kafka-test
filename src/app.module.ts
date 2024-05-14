import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from './controllers/home';
import { CalcModule } from './services/calc';

@Module({
  imports: [CalcModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
