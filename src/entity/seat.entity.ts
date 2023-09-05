import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Room } from './room.entity';
export enum seatEnum {
  일인석 = 1,
  사인석 = 2,
  회의실 = 3,
}
@Entity({ schema: 'apple', name: 'seat' })
export class Seat {
  @PrimaryGeneratedColumn()
  seatId: number;

  @ManyToOne(() => Room, (room) => room.seats)
  rooms: Room;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column()
  price: number;

  @Column()
  roomId: number;

  @Column({ type: 'enum', enum: seatEnum, default: seatEnum.일인석 })
  type: seatEnum;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
