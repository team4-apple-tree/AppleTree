import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;
}
