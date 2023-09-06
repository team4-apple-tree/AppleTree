import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Stopwatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime: Date;

  @Column({ type: 'timestamp', default: null, nullable: true })
  endTime: Date;

  @Column({ type: 'integer' })
  targetSeconds: number;

  @ManyToOne(() => User, (user) => user.stopwatches)
  user: User;
}
