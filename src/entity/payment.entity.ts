import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TimeTable } from './timeTable.entity';
import { User } from './user.entity';

@Entity({ schema: 'apple', name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  points: number;

  @CreateDateColumn()
  paymentTime: Date;

  @Column()
  userId: number;

  @OneToMany(() => TimeTable, (timeTable) => timeTable.payments)
  timeTable: TimeTable;

  @OneToMany(() => User, (user) => user.payments)
  user: User;
}
