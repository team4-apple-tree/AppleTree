import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    ManyToOne,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
  
  } from 'typeorm';
import { User } from './user.entity'

  @Entity({ schema: 'apple', name: 'board' })
export class Board {
  @PrimaryGeneratedColumn()
  boardId: number;

  @ManyToOne(()=>User, user=> user.boards)
  user:User

  @Column('varchar')
  category : string

  @Column('varchar')
  desc : string

  @Column('varchar')
  name : string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}