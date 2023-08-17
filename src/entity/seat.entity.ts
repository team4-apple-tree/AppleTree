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
import { Room } from './room.entity'
  @Entity({ schema: 'apple', name: 'seat' })
export class Seat {
  @PrimaryGeneratedColumn()
  seatId: number;

  @ManyToOne(()=>Room, room=>room.seats)
  rooms:Room

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}