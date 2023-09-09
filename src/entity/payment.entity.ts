import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ schema: 'apple', name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  points: number;

  @CreateDateColumn()
  paymentTime: Date;
}
