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

  @Entity({ schema: 'apple', name: 'post' })
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @ManyToOne(()=>User, user=> user.posts)
  user:User

  @Column('varchar')
  title : string

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