import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne
  
  } from 'typeorm';
  import { Seats } from './seat.entity'
  import { User } from './user.entity'
  export enum typeEnum {
    원형 =1,
    타원형 =2,
    사각형 =3,
  }

  @Entity({ schema: 'apple', name: 'room' })
export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @ManyToOne(()=>User, user=>user.rooms)
  user:User
  @OneToMany(()=>Seats, seat=>seat.rooms)
  seats:Seats

  @Column('varchar')
  name: string;
  
  @Column('varchar')
  address: string;

  @Column({ type: 'enum', enum: typeEnum, default: typeEnum.사각형 })
  type: typeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}