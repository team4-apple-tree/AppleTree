import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Seat } from './seat.entity';
import { Room } from './room.entity';

enum SeatType {
  일인석 = 1,
  사인석 = 2,
  회의실 = 3,
}
@Entity({ schema: 'apple', name: 'seatprice' })
export class SeatPrice {
  @PrimaryGeneratedColumn()
  seatPriceId: number;

  @ManyToOne(() => Room, (room) => room.seatPrices)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => Seat, (seat) => seat.seatPrices)
  @JoinColumn({ name: 'seatId' })
  seat: Seat;

  @Column({ type: 'enum', enum: SeatType })
  type: SeatType;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
