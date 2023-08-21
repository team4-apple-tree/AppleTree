import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
<<<<<<< HEAD
  OneToOne,
  Index,
=======
>>>>>>> cf4881f0c9eb4f42147aa1661ea9f72c42731716
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Card } from './card.entity';
import { Member } from './member.entity';

export enum ToDoState {
  TODO = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}

@Entity({ schema: 'apple', name: 'todo' })
export class Todo {
  @PrimaryGeneratedColumn()
  todoId: number;

  @OneToMany(() => Card, (card) => card.toDos)
  cards: Card[];

  @ManyToOne(() => Member, (member) => member.toDos)
  members: Member;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column()
  state: ToDoState;
}
