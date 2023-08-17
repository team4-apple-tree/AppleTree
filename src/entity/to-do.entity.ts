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
import { Card } from './card.entity';
import { Member } from './member.entity';

  @Entity({ schema: 'apple', name: 'todo' })
export class Todo {
  @PrimaryGeneratedColumn()
  todoId: number;

  @OneToMany(()=>Card, card=>card.toDos)
  cards:Card
  @ManyToOne(()=>Member, member=>member.toDos)
  members:Member

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}