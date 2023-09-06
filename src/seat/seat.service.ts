import { Repository, In, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { Seat, seatEnum } from 'src/entity/seat.entity';
import { createSeatDto } from 'src/dto/seat/create-seat-dto';
import { Room } from '../entity/room.entity';
import { SeatPrice } from 'src/entity/seatPrice.entity';

@Injectable()
export class SeatService {
  private client: MongoClient;
  private readonly mongoUri: string;

  constructor(
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(SeatPrice)
    private seatPriceRepository: Repository<SeatPrice>,
    private readonly configService: ConfigService,
  ) {
    this.mongoUri = this.configService.get<string>('MONGODB_ATLAS');
    const mongoOptions: MongoClientOptions = {};

    this.client = new MongoClient(this.mongoUri, mongoOptions);
  }

  async createSeat(type: number, row: number, column: number): Promise<void> {
    try {
      await this.client.connect();
      console.log('MongoDB에 연결되었습니다.');

      const db: Db = this.client.db('seat');

      // 사각형 모양의 2차원 배열 생성
      const seatShape: number[][] = Array.from({ length: row }, () =>
        Array(column).fill(0),
      );

      // MongoDB에 좌석 모양 저장
      const seatData = {
        seatShape,
      };
      await db.collection('seatShapes').insertOne({ type, seatData });
      console.log(seatData);
      console.log('좌석 모양이 MongoDB에 저장되었습니다.');
    } catch (error) {
      console.error(
        'MongoDB에 연결하거나 데이터를 저장하는 동안 오류가 발생했습니다:',
        error,
      );
    } finally {
      await this.client.close();
      console.log('MongoDB 연결이 닫혔습니다.');
    }
  }

  async create(data: createSeatDto[], roomId: number) {
    try {
      for (const seatData of data) {
        const seat = new Seat();
        seat.type = seatData.type;
        seat.row = seatData.row;
        seat.column = seatData.column;
        seat.price = seatData.price;
        seat.roomId = roomId;
        await this.seatRepository.save(seat);
      }
      console.log('좌석정보생성 테스트', Seat);
    } catch (error) {
      console.error('MySQL로 좌석 생성 중 에러가 났습니다', error);
    }
  }

  async seatInfo(roomId: number) {
    const seats = await this.seatRepository.find({
      where: { roomId },
    });
    // 3. seatIds 배열을 만듭니다.
    const seatIds = seats.map((seat) => seat.seatId);
    // 4. seatIds를 사용하여 해당 seat들에 대한 seatPrice 정보를 로드합니다.
    const seatPrices = await this.seatPriceRepository.find({
      where: { seatId: In(seatIds) }, // In을 사용하여 여러 seatId를 필터링합니다.
      select: ['price', 'type', 'seatId'],
    });

    const seatPriceMap = new Map<string, number>(); // seatPrice를 type으로 매핑할 Map

    for (const seatPrice of seatPrices) {
      seatPriceMap.set(seatPrice.type.toString(), seatPrice.price);
    }
    const seatInfo = {
      seats,
    };
    // 비동기 작업을 수행할 Promise 배열 생성
    const promises = seats.map(async (seat) => {
      const price = seatPriceMap.get(seat.type.toString());
      if (price !== undefined) {
        seat.prices = price;
      } else {
        seat.prices = 0;
      }
    });
    // 비동기 작업들을 병렬로 실행
    await Promise.all(promises);

    console.log(seatInfo);
    return seatInfo;
  }
}
