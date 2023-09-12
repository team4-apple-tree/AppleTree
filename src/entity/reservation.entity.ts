import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TimeTable } from './timeTable.entity';
import { Seat } from './seat.entity';
import { Room } from './room.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timeTableId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reservationTime: Date;

  @Column({ type: 'boolean', default: false })
  stats: boolean;

  @Column()
  seatId: number;

  @Column()
  userId: number;

  @ManyToOne(() => TimeTable, (timeTable) => timeTable.reservations)
  timeTable: TimeTable;

  @ManyToOne(() => Seat, (seat) => seat.reservation)
  seat: Seat;

  @ManyToOne(() => Room, (room) => room.reservations) // Room 엔터티와 관계 설정
  room: Room; 
}
