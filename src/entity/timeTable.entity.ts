import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
  } from 'typeorm';
  import { Reservation } from './reservation.entity';
  import { Payment } from './payment.entity';
  import { Room } from './room.entity';
  
  @Entity({ schema: 'apple', name: 'timeTable' })
  export class TimeTable {
    @PrimaryGeneratedColumn()
    timeTableId: number;
  
    @ManyToOne(() => Room, (room) => room.timeTable)
    rooms: Room;
  
    @ManyToOne(() => Payment, (payment) => payment.timeTable)
    payments: Payment;
  
    @OneToMany(() => Reservation, (reservation) => reservation.timeTable)
    reservations: Reservation;
  
    @Column()
    roomId: number;
  
    @Column({ type: 'varchar' }) // 시간대 정보
    timeSlot: String;
  }
  