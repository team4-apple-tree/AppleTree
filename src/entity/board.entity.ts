import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    ManyToOne,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
  
  } from 'typeorm';
import { User } from './user.entity'
import { Post } from './post.entity'
  @Entity({ schema: 'apple', name: 'board' })
export class Board {
  @PrimaryGeneratedColumn()
  boardId: number;

  @ManyToOne(()=>User, user=> user.boards)
  user:User
  @OneToMany(()=>Post, post=> post.boards)
  posts:Post

  @Column('varchar')
  category : string

  @Column('varchar')
  desc : string

  @Column('varchar')
  name : string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}