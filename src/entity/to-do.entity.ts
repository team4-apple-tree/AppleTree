import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Card } from './card.entity';
import { Member } from './member.entity';
import { Group } from './group.entity';

export enum ToDoState {
  TODO = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
}

@Entity({ schema: 'apple', name: 'todo' })
export class Todo {
  @PrimaryGeneratedColumn()
  todoId: number;

  // @OneToMany(() => Card, (card) => card.toDos)
  // cards: Card[];

  // @ManyToOne(() => Member, (member) => member.toDos)
  // members: Member;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column()
  state: ToDoState;

  @ManyToOne(() => Group, (group) => group.todos) // Group과의 일대다 관계 설정
  group: Group;
}
