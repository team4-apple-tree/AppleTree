import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seat.service';
import { SeatModule } from './seat.module';
import { Repository } from 'typeorm';
import { Seat } from 'src/entity/seat.entity';
import { Room } from 'src/entity/room.entity';
import { SeatPrice } from 'src/entity/seatPrice.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SeatService', () => {
  let service: SeatService;
  let seatRepository: Repository<Seat>;
  let roomRepository: Repository<Room>;
  let seatPriceRepository: Repository<SeatPrice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SeatModule],
      providers: [SeatService],
    }).compile();

    service = module.get<SeatService>(SeatService);
    seatRepository = module.get<Repository<Seat>>(getRepositoryToken(Seat));
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    seatPriceRepository = module.get<Repository<SeatPrice>>(
      getRepositoryToken(SeatPrice),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
