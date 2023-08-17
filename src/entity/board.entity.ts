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
  
  @Entity({ schema: 'apple', name: 'board' })
export class Board {
  @PrimaryGeneratedColumn()
  boardId: number;

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