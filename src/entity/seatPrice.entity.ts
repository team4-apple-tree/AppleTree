import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Seat } from './seat.entity';
import { seatEnum } from './seat.entity';
import { IsEnum, IsOptional } from 'class-validator';

@Entity({ schema: 'apple', name: 'seatprice' })
export class SeatPrice {
  @PrimaryGeneratedColumn()
  seatPriceId: number;

  @ManyToOne(() => Seat, (seat) => seat.seatPrices)
  seats: Seat;

  @Column('varchar')
  @IsOptional()
  type: seatEnum | null;

  @Column()
  price: number;

  @Column()
  seatId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
