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

@Entity({ schema: 'apple', name: 'point' })
export class Point {
  @PrimaryGeneratedColumn()
  pointId: number;

  @Column({ default: 0 })
  point: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.points)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
