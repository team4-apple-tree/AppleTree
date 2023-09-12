import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Room } from './room.entity';
import { Group } from './group.entity';
import { Payment } from './payment.entity';
import { Point } from './point.entity';
export enum roleEnum {
  유저 = 1,
  관리자 = 2,
  마스터 = 3,
}
@Entity({ schema: 'apple', name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Member, (member) => member.user)
  members: Member[];
  @OneToMany(() => Room, (room) => room.user)
  rooms: Room[];

  @OneToMany(() => Group, (group) => group.user)
  groups: Group[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment;

  @OneToMany(() => Point, (point) => point.user)
  points: Point;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar', { default: null })
  desc: string;

  @Column('varchar', { select: false })
  password: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date | null;

  @Column({ type: 'enum', enum: roleEnum, default: roleEnum.유저 })
  role: roleEnum;

  @Column('varchar', { nullable: true })
  profileImage: string;
}
