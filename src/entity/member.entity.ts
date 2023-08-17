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
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Todo } from './to-do.entity';

@Entity({ schema: 'apple', name: 'member' })
export class Member {
  @PrimaryGeneratedColumn()
  memberId: number;

  @ManyToOne(() => User, (user) => user.members)
  user: User;
  @OneToMany(() => Todo, (todo) => todo.members)
  toDos: Todo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
