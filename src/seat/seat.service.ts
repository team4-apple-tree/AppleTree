import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, MongoClientOptions, Db } from 'mongodb';
import { Seat } from 'src/entity/seat.entity';
import { createSeatDto } from 'src/dto/seat/create-seat-dto';
import { Room, typeEnum } from '../entity/room.entity';
import { type } from 'os';

@Injectable()
export class SeatService {
  private client: MongoClient;
  private readonly mongoUri: string;

  constructor(
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    // @InjectRepository(Room) private roomRepository: Repository<Room>,
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
    const seat = await this.seatRepository.find({
      where: { roomId },
    });
    return seat;
  }

  async fetchSeatShape(type: number): Promise<number[][] | null> {
    try {
      await this.client.connect();
      const db: Db = this.client.db('seat');
      const seatData = await db.collection('seatShapes').findOne({ type });
      if (seatData && seatData.seatData) {
        return seatData.seatData.seatShape;
      }
      return null;
    } catch (error) {
      console.error(
        'MongoDB에서 좌석 모양을 불러오는 동안 오류가 발생했습니다:',
        error,
      );
      return null;
    } finally {
      await this.client.close();
    }
  }
}
