import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    Index,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
  
  } from 'typeorm';
import { User } from './user.entity'
import { Post } from './post.entity'

  @Entity({ schema: 'apple', name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @ManyToOne(()=>User, user=> user.comments)
  user:User
  @ManyToOne(()=>Post, post=> post.comments)
  posts:Post

  @Column('varchar')
  comment : string

  @Column('varchar')
  name : string

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}