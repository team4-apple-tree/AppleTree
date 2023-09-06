import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { Room } from './room.entity';
import { SeatPrice } from './seatPrice.entity';
import { RoomStructure } from './roomStructure.entity';

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

  @OneToMany(() => SeatPrice, (seatPrice) => seatPrice.seats)
  @JoinColumn({ name: 'seatId' })
  seatPrices: SeatPrice[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column()
  price: number;

  @Column()
  prices: number;

  @Column()
  roomId: number;

  @Column({ type: 'enum', enum: seatEnum, default: seatEnum.일인석 })
  type: seatEnum;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ default: false })
  reservationStatus: boolean;

  @ManyToOne(() => RoomStructure)
  roomStructure: RoomStructure;
}
