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
  import { Board } from './board.entity'
  import { Comment } from './comment.entity'
  
  @Entity({ schema: 'apple', name: 'post' })
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @ManyToOne(()=>User, user=> user.posts)
  user:User
  @ManyToOne(()=>Board, board=>board.posts)
  boards:Board
  @OneToMany(()=>Comment, comment=>comment.posts)
  comments:Comment

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