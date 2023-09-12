import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
