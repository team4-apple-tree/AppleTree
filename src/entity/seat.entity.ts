import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { SeatPrice } from './seatPrice.entity';
import { TimeTable } from './timeTable.entity';
import { Reservation } from './reservation.entity';

export enum SeatType {
  일인석 = 1,
  사인석 = 2,
  회의실 = 3,
}

@Entity({ schema: 'apple', name: 'seat' })
export class Seat {
  @PrimaryGeneratedColumn()
  seatId: number;

  @ManyToOne(() => Room, (room) => room.seats)
  @JoinColumn({ name: 'roomId' }) // JoinColumn 데코레이터를 추가
  room: Room;

  @OneToMany(() => Reservation, (reservation) => reservation.seats)
  reservations: Reservation;

  @OneToMany(() => SeatPrice, (seatPrice) => seatPrice.seat)
  @JoinColumn({ name: 'seatId' })
  seatPrices: SeatPrice[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column({ default: 0 })
  price: number;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.일인석 })
  type: SeatType;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ default: false })
  reservationStatus: boolean;
}
