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
import { Group } from './group.entity';

export enum ToDoState {
  TODO = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}
@Entity({ schema: 'apple', name: 'card' })
export class Card {
  @PrimaryGeneratedColumn()
  cardId: number;

  @Column()
  title: string;

  @Column()
  desc: string;

  @Column({ type: 'enum', enum: ToDoState, default: ToDoState.TODO })
  selectToDo: ToDoState;

  @ManyToOne(() => Todo, (todo) => todo.cards)
  @JoinColumn({ name: 'todoId' })
  toDos: Todo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Group, (group) => group.todos) // Group과의 일대다 관계 설정
  group: Group;
}
