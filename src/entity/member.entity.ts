import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

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
