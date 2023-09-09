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
  room: Room;

  @OneToMany(() => SeatPrice, (seatPrice) => seatPrice.seat)
  seatPrices: SeatPrice[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.일인석 })
  type: SeatType;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ default: false })
  reservationStatus: boolean;
}
