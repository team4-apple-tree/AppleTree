import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from '../entity/seat.entity';
import { TimeTable } from '../entity/timeTable.entity';
import { timeTableDto } from 'src/dto/time-table/createTimeTable.dto';
import { Reservation } from '../entity/reservation.entity';
import { Room } from 'src/entity/room.entity';
import { Payment } from 'src/entity/payment.entity';
import { Point } from 'src/entity/point.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TimeTableService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(TimeTable)
    private timeTableRepository: Repository<TimeTable>,
    @InjectRepository(Seat) private seatRepository: Repository<Seat>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  async createTimetableForSeat(
    data: timeTableDto,
    roomId: number,
  ): Promise<void> {
    const { startTime, endTime } = data;

    const startTimeArray = startTime.split(':');
    const endTimeArray = endTime.split(':');

    const startDate = new Date();
    startDate.setHours(parseInt(startTimeArray[0]));
    startDate.setMinutes(parseInt(startTimeArray[1]));

    const endDate = new Date();
    endDate.setHours(parseInt(endTimeArray[0]));
    endDate.setMinutes(parseInt(endTimeArray[1]));

    const timeTableRepository = this.timeTableRepository;

    while (startDate < endDate) {
      const timeTable = new TimeTable();
      const hours = startDate.getHours().toString().padStart(2, '0');
      const minutes = startDate.getMinutes().toString().padStart(2, '0');
      timeTable.timeSlot = `${hours}:${minutes}`;
      timeTable.roomId = roomId;
      await timeTableRepository.save(timeTable); // TimeTable 저장

      // 다음 시간으로 이동 (1시간 더하기)
      startDate.setHours(startDate.getHours() + 1);
    }
  }

  private async deleteReservation(reservationId: number): Promise<void> {
    // 예약 정보를 데이터베이스에서 삭제
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new Error('예약을 찾을 수 없습니다.');
    }
    await this.reservationRepository.remove(reservation);
  }

  async makeReservation(
    timeTableIds: number[],
    seatIds: number[],
    userId: number,
  ): Promise<void> {
    const reservations: Reservation[] = [];
    for (const timeTableId of timeTableIds) {
      const timeTable = await this.timeTableRepository.findOne({
        where: { timeTableId },
        select: ['timeSlot'],
      });

      if (!timeTable) {
        throw new HttpException(
          `해당 시간표를 찾을 수 없습니다. (timeTableId: ${timeTableId})`,
          HttpStatus.BAD_REQUEST,
        );
      }

      for (const seatId of seatIds) {
        const seat = await this.seatRepository.findOne({ where: { seatId } });
        if (!seat) {
          throw new HttpException(
            `해당 좌석을 찾을 수 없습니다. (seatId: ${seatId})`,
            HttpStatus.BAD_REQUEST,
          );
        }
        console.log(seat);
        const existingReservation = await this.reservationRepository.findOne({
          where: { timeTableId, seatId },
        });
        if (!existingReservation) {
          const reservation = new Reservation();
          reservation.timeTableId = timeTableId;
          reservation.seatId = seatId;
          reservation.userId = userId;

          await this.reservationRepository.save(reservation);
          const paymentSuccessful = await this.processPayment(
            seat.price,
            userId,
          ); // 결제 처리 함수
          if (paymentSuccessful) {
            await this.reservationRepository.save(reservation);
            // 예약 취소 타이머 설정 (예: 30분 후에 취소)
            setTimeout(async () => {
              // 예약 상태 확인
              const updatedReservation =
                await this.reservationRepository.findOne({
                  where: { timeTableId, seatId },
                  select: ['stats'], // state를 조회하도록 변경
                });

              if (updatedReservation && !updatedReservation.stats) {
                // 이미 결제가 완료되었으면 취소하지 않음
                return;
              }
              // 예약 취소 처리
              updatedReservation.stats = true;
              await this.deleteReservation(reservation.id); // 예시: 예약 정보 삭제 함수
            }, 10 * 60 * 1000); // 10분 후에 실행 (밀리초 단위)
          } else {
            // 결제가 실패한 경우, 상태를 true로 변경하여 예약 취소
            await this.reservationRepository.update(timeTableId, {
              stats: true,
            }); // state를 true로 변경
            throw new HttpException(
              '결제가 실패하여 예약이 취소되었습니다. 남은 포인트를 확인해주세요',
              HttpStatus.BAD_REQUEST,
            );
          }
          reservations.push(reservation);
        } else {
          throw new HttpException(
            '해당 시간대에 예약할 수 없습니다.',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
  }

  private async processPayment(
    amount: number,
    userId: number,
  ): Promise<boolean> {
    // const userId = 2; // userId 주입
    console.log(userId);
    const point = await this.pointRepository.findOne({ where: { userId } });
    if (!point) {
      throw new Error('포인트를 조회 할 수 없습니다.');
    }
    if (point.point < amount) {
      return false;
    }
    const payment = new Payment();
    payment.userId = userId;
    payment.points = amount;
    point.point -= amount;

    await this.paymentRepository.save(payment);
    await this.pointRepository.save(point);
    return true;
  }

  // 스케줄러 메서드: 매일 자정에 실행
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleScheduledTask() {
    try {
      console.log('자정에 예약 정보가 모두 삭제됩니다.');
      // 예약 정보 삭제
      await this.deleteSchedule();

      console.log('예약 정보 삭제가 완료되었습니다/');
    } catch (error) {
      console.error('예약 정보 삭제 중 error', error);
    }
  }

  private async deleteSchedule(): Promise<void> {
    // 예약 정보를 데이터베이스에서 삭제
    const reservation = await this.reservationRepository.find();
    if (!reservation) {
      throw new Error('예약을 찾을 수 없습니다.');
    }
    await this.reservationRepository.remove(reservation);
  }

  // 해당 룸의 타임테이블 조회
  async findTimeTablesByRoomId(roomId: number): Promise<TimeTable[]> {
    return await this.timeTableRepository.find({
      where: { roomId },
    });
  }
}
