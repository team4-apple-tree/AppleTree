import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'roomStructure' })
export class RoomStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rows: number;

  @Column()
  columns: number;

  @Column({ type: 'text', nullable: true })
  seatShape: string;
}
