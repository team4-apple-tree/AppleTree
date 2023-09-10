import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Room } from './room.entity';

@Entity({ name: 'roomstructure' })
export class RoomStructure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rows: number;

  @Column()
  columns: number;

  @Column({ type: 'text', nullable: true })
  seatShape: string;

  @OneToOne(() => Room, (room) => room.roomStructure, { onDelete: 'CASCADE' })
  room: Room;
}
