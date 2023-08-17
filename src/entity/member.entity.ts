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
  import { User } from './user.entity'

  @Entity({ schema: 'apple', name: 'member' })
export class Member {
  @PrimaryGeneratedColumn()
  memberId: number;

  @ManyToOne(()=>User, user=> user.posts)
  user:User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}