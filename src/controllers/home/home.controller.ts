import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Sse,
} from '@nestjs/common';
import { HomeEntity } from './home.entity';
import { KafkaConsumer } from '../../services/kafka';
import { DateParamsDto, PaginationDto } from '../../validators';

@Controller('home')
export class HomeController {
  constructor(
    private kafkaConsumer: KafkaConsumer,
    private homeEntity: HomeEntity,
  ) {
    this.kafkaConsumer.tryConsume('sum', 'unread-group', (data) =>
      this.homeEntity.set(data),
    );
  }

  private async checkConsumer() {
    return this.kafkaConsumer.tryConsume('sum', 'unread-group', (data) =>
      this.homeEntity.set(data),
    );
  }

  @Sse()
  sse() {
    return this.kafkaConsumer.subscribeToTopic('sum', 'sse-group', (data) => {
      if (!Array.isArray(data)) {
        return 'Invalid data for "sum" topic';
      }
      return `${new Date()}: sum of elements [${data.join(', ')}] equal = ${data.reduce((sum, value) => (sum += value), 0)}`;
    });
  }

  @Get('bydate')
  async findByDate(@Query() params: DateParamsDto) {
    await this.checkConsumer();
    if (params.endTo) {
      return this.homeEntity.findByDate(params.startFrom, params.endTo);
    }
    return this.homeEntity.takeByDate(params.startFrom, params.take || 10);
  }

  @Get('pagination')
  async pagination(@Query() params: PaginationDto) {
    await this.checkConsumer();
    return this.homeEntity.take(params.skip, params.take);
  }

  @Get('count')
  async getCount() {
    await this.checkConsumer();
    return this.homeEntity.count();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    await this.checkConsumer();
    return this.homeEntity.get(id);
  }
}
