import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Room, typeEnum } from 'src/entity/room.entity';
import { Seats, kindEnum } from 'src/entity/seat.entity';
import { createSeatDto } from 'src/dto/seat/create-seat-dto';
import { updateSeatDto } from '../dto/seat/update-seat-dto';
import { Seat } from '../dto/seat/create-seat-dto';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seats) private seatRepository: Repository<Seats>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
  ) {}
  //   async createSeat(type:typeEnum, price:number, roomId:number ){
  //     const roomType = await this.roomRepository.findOne({
  //         where : {roomId, deletedAt:null},
  //         select : ['type']
  //     })
  //     if(roomType.type===1){
  //         const circle = await this.createCircle
  //     }
  //     if(roomType.type===2){
  //         const oval = await this.createOval
  //     }
  //     if(roomType.type===3){
  //         const square = await this.createSquare
  //     }
  //   }

  //   async updateSeat(seatId:number, newKind:kindEnum, price:number) {
  //     const seat = await this.seatRepository.findOne({
  //         where: {deletedAt:null, seatId}
  //     })
  //     const update = {price , kind:newKind}
  //     return this.seatRepository.update(seatId, {update})
  //   }

  async updateSeat(seatId: number, kind: kindEnum, price: number) {
    const seat = await this.seatRepository.findOne({
      where: { deletedAt: null, seatId },
    });

    if (!seat) {
      throw new NotFoundException(`Seat with ID ${seatId} not found`);
    }

    const updateData = {
      price: price,
      kind: kind,
    };

    return this.seatRepository.update(seatId, updateData);
  }

  async deleteSeat(seatId: number) {
    await this.seatRepository.findOne({
      where: { deletedAt: null, seatId },
    });
    return this.seatRepository.softDelete(seatId);
  }
  // }

  async createSeat(roomId: number, data: createSeatDto) {
    const roomType = await this.roomRepository.findOne({
      where: { roomId, deletedAt: null },
      select: ['type'],
    });

    if (!roomType || !roomType.type) {
      throw new NotFoundException('Room type not found');
    }
    let seats: Seat[][];

    if (roomType.type === 1) {
      seats = await this.createCircle(data.row, data.column);
    } else if (roomType.type === 2) {
      seats = await this.createEllipse(data.row, data.column);
    } else if (roomType.type === 3) {
      seats = await this.createSquare(data.row, data.column);
    } else {
      throw new Error('Unsupported room type');
    }
    console.log(seats);
    const seatEntities: Seats[] = [];
    console.log(seatEntities);

    for (let y = 0; y < seats.length; y++) {
      for (let x = 0; x < seats[y].length; x++) {
        if (seats[y][x][2]) {
          // 타원 내부에 있는 좌석인지 확인
          // const seatEntity = new Seats();
          const seatEntity = new Seats();
          seatEntity.kind = data.kind;
          seatEntity.price = data.price;
          seatEntity.x = y;
          seatEntity.y = x;
          seatEntities.push(seatEntity);
          // console.log(seatEntity)
        }
      }
    }
    // return seats;
    // const createdSeats = await this.seatRepository.save(seats.flat());
    // return createdSeats;
    const createdSeats = await this.seatRepository.save(seatEntities);
    console.log(createdSeats);
    return createdSeats;
  }

  // Use the seats data as needed

  // 예를 들어, 생성된 좌석을 데이터베이스에 저장하려면 다음과 같이 할 수 있습니다.
  // const createdSeats = await this.seatRepository.save(seats.flat());
  // flat() 메서드는 2차원 배열을 1차원 배열로 평탄화합니다.
  // 이후 createdSeats를 필요에 따라 반환하거나 활용할 수 있습니다.
  // }

  private async createEllipse(
    rows: number,
    columns: number,
  ): Promise<Seat[][]> {
    const seats: Seat[][] = [];

    const centerX = columns / 2;
    const centerY = rows / 2;
    const a = centerX - 1; // 임의로 설정한 장축의 반지름
    const b = centerY - 1; // 임의로 설정한 단축의 반지름

    // 좌석 생성 로직: 타원의 방정식을 이용하여 좌석 위치 계산
    for (let y = 0; y < rows; y++) {
      const row: Seat[] = [];
      for (let x = 0; x < columns; x++) {
        const isInsideEllipse =
          ((x - centerX) * (x - centerX)) / (a * a) +
            ((y - centerY) * (y - centerY)) / (b * b) <=
          1;
        row.push([x, y, isInsideEllipse]); // 좌석 정보를 배열에 추가
      }
      seats.push(row);
    }
    console.log(seats);
    return seats;
  }

  private async createCircle(rows: number, columns: number): Promise<Seat[][]> {
    const seats: Seat[][] = [];

    // 중심 좌표 계산
    const centerX = Math.floor(columns / 2);
    const centerY = Math.floor(rows / 2);

    // 반지름 계산 (원의 지름은 좌석 행 또는 열 중 작은 값의 절반)
    const radius = Math.min(columns, rows) / 2;

    // 원형 좌석 생성 로직
    for (let y = 0; y < rows; y++) {
      const row: Seat[] = [];
      for (let x = 0; x < columns; x++) {
        // 현재 좌표와 중심 간의 거리 계산
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

        // 거리가 반지름 이내인 경우 원 안에 있는 좌석으로 표시
        const isInsideCircle = distance <= radius;

        row.push([x, y, isInsideCircle]); // 좌석 정보를 배열에 추가
      }
      seats.push(row);
    }
    console.log(seats);
    return seats;
  }

  // private async createSquare(rows: number, columns: number): Promise<Seat[][]> {
  //   const seats: Seat[][] = [];

  //   // 사각형 좌석 생성 로직

  //   return seats;
  // }

  private async createSquare(rows: number, columns: number): Promise<Seat[][]> {
    const seats: Seat[][] = [];

    // 가로와 세로의 좌석 수 계산
    const seatsPerRow = Math.min(columns, rows);
    const seatsPerColumn = Math.max(columns, rows);

    // 사각형 좌석 생성 로직
    for (let y = 0; y < seatsPerColumn; y++) {
      const row: Seat[] = [];
      for (let x = 0; x < seatsPerRow; x++) {
        const isInsideSquare = true; // 항상 사각형 안에 있는 좌석으로 설정
        row.push([x, y, isInsideSquare]); // 좌석 정보를 배열에 추가
      }
      seats.push(row);
    }

    console.log(seats);
    return seats;
  }
}
