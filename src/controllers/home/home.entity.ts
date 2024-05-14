import { Injectable, NotFoundException } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';

@Injectable()
export class HomeEntity {
  private map = new Map<number, KafkaMessage>();

  set(message: KafkaMessage) {
    this.map.set(parseInt(message.offset), message);
  }

  count(): number {
    return this.map.size;
  }

  get(id: number) {
    if (!this.map.has(id)) {
      throw new NotFoundException();
    }
    const value = this.map.get(id).value;
    const result = {};
    result[id] = JSON.parse(value.toString());
    return result;
  }

  findByDate(startFrom: number, endTo: number) {
    const result = {};

    this.map.forEach((value, key) => {
      const timestamp = parseInt(value.timestamp);
      if (timestamp >= startFrom && timestamp <= endTo) {
        result[key] = JSON.parse(value.value.toString());
      }
    });

    return result;
  }

  takeByDate(startFrom: number, take: number) {
    let index: number = NaN;

    this.map.forEach((value, key) => {
      const timestamp = parseInt(value.timestamp);
      if (timestamp >= startFrom && (isNaN(index) || index > key)) {
        index = key;
      }
    });

    return this.take(index, take);
  }

  take(skip: number, take: number) {
    const result = {};

    for (let i = skip; i < skip + take; i++) {
      if (this.map.has(i)) {
        result[i] = JSON.parse(this.map.get(i).value.toString());
      }
    }

    return result;
  }
}
