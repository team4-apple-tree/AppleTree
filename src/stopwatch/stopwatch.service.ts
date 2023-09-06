import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stopwatch } from '../entity/stopwatch.entity';
import { User } from '../entity/user.entity';

@Injectable()
export class StopwatchService {
  constructor(
    @InjectRepository(Stopwatch)
    private stopwatchRepository: Repository<Stopwatch>,
  ) {}

  async createStopwatch(
    userId: number,
    targetSeconds: number,
  ): Promise<Stopwatch> {
    const stopwatch = new Stopwatch();
    stopwatch.user = { id: userId } as User;
    stopwatch.targetSeconds = targetSeconds;
    return await this.stopwatchRepository.save(stopwatch);
  }

  async endStopwatch(stopwatchId: number): Promise<Stopwatch> {
    const stopwatch = await this.stopwatchRepository.findOne({
      where: { id: stopwatchId },
    });
    if (!stopwatch) {
      throw new NotFoundException('Stopwatch not found');
    }

    stopwatch.endTime = new Date();
    return await this.stopwatchRepository.save(stopwatch);
  }
}
