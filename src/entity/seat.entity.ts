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
    DeleteDateColumn
  
  } from 'typeorm';
  import { SeatDto } from '../dto/seat/seat-dto'
import { Room } from './room.entity'
export enum kindEnum {
  일인용 = 1,
  미팅룸 = 2,
  회의실 = 3,
  없음 = 4
}
  @Entity({ schema: 'apple', name: 'seat' })
export class Seats {
  @PrimaryGeneratedColumn()
  seatId: number;

  @ManyToOne(()=>Room, room=>room.seats)
  rooms:Room

  @Column('varchar')
  price: number;

  @Column({ type: 'enum', enum: kindEnum, default: kindEnum.일인용 })
  kind: kindEnum;

  // @Column({ type: 'json' })
  // seat: SeatDto[]
  @Column()
  x: number

  @Column()
  y: number

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}