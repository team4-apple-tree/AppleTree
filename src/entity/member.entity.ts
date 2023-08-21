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
  PrimaryColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Todo } from './to-do.entity';
import { Group } from './group.entity';

export enum Role {
  리더 = 1,
  조원 = 2,
}

@Entity({ schema: 'apple', name: 'member' })
@Unique(['user', 'group'])
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => User, (user) => user.members)
  // user: User;
  // @OneToMany(() => Todo, (todo) => todo.members)
  // toDos: Todo;

  // @PrimaryColumn()
  // userId: number;

  // @PrimaryColumn()
  // groupId: number;

  @ManyToOne(() => User, (user) => user.members)
  user: User;
  @ManyToOne(() => Group, (group) => group.members)
  group: Group;

  @Column({ type: 'enum', enum: Role, default: Role.조원 })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
