import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
  
  } from 'typeorm';

  @Entity({ schema: 'apple', name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

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