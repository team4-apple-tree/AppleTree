import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Todo } from './to-do.entity';

@Entity({ schema: 'apple', name: 'card' })
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  @ManyToOne(() => Todo, (todo) => todo.cards)
  @JoinColumn({ name: 'todoId' })
  toDos: Todo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
