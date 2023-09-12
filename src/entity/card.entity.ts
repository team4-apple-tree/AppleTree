import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(() => Group, (group) => group.card) // Many-to-one relationship to Group
  group: Group;
}
