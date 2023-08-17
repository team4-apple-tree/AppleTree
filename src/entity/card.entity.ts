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
import { Todo } from './to-do.entity';

  @Entity({ schema: 'apple', name: 'card' })
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @ManyToOne(()=>Todo, todo=>todo.cards)
  toDos:Todo


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}