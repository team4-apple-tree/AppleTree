import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Seat } from './seat.entity';
import { User } from './user.entity';
import { RoomStructure } from './roomStructure.entity';
import { IsString, Length, IsNotEmpty } from 'class-validator'; // class-validator를 추가합니다.
import { SeatPrice } from './seatPrice.entity';
import { TimeTable } from './timeTable.entity';
import { Reservation } from './reservation.entity';

@Entity({ schema: 'apple', name: 'room' })
export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @OneToOne(() => RoomStructure, (roomStructure) => roomStructure.room)
  @JoinColumn()
  roomStructure: RoomStructure;
  @ManyToOne(() => User, (user) => user.rooms)
  user: User;

  @OneToMany(() => TimeTable, (timeTable) => timeTable.rooms)
  timeTable: TimeTable[];

  @OneToMany(() => Seat, (seat) => seat.room)
  seats: Seat[];

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  @Length(1, 255) // 최소 1자 이상, 255자 이하
  name: string;

  @Column('varchar')
  @IsString()
  @IsNotEmpty()
  @Length(1, 255) // 최소 1자 이상, 255자 이하
  address: string;

  @OneToMany(() => SeatPrice, (seatPrice) => seatPrice.room)
  seatPrices: SeatPrice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column('varchar', { nullable: true })
  image: string;
}
