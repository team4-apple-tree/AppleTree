import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Group } from './group.entity';

@Entity({ schema: 'apple', name: 'access' })
// @Unique(['user', 'group'])
export class Access {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.access)
  user: User;

  @ManyToOne(() => Group, (group) => group.access)
  group: Group;
}
