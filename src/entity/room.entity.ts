import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Seat } from './seat.entity';
import { User } from './user.entity';
import { TimeTable } from './timeTable.entity';
export enum typeEnum {
  A25 = 1,
  A50 = 2,
  A75 = 3,
  A100 = 4,
  A125 = 5,
  A150 = 6,
  A175 = 7,
  A200 = 8,
}

@Entity({ schema: 'apple', name: 'room' })
export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @ManyToOne(() => User, (user) => user.rooms)
  user: User;
  @OneToMany(() => Seat, (seat) => seat.rooms)
  seats: Seat[]
  @OneToMany(()=> TimeTable,(timeTable)=> timeTable.rooms)
  timeTable:TimeTable[]

  @Column('varchar')
  name: string;

  @Column('varchar')
  address: string;

  @Column({ type: 'enum', enum: typeEnum, default: typeEnum.A25 })
  type: typeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
