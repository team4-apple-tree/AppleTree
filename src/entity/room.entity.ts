import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne
  
  } from 'typeorm';
  import { User } from './user.entity'

  @Entity({ schema: 'apple', name: 'room' })
export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @ManyToOne(()=>User, user=>user.rooms)
  user:User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}