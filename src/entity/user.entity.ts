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
import { Member } from './member.entity';
import { Board } from './board.entity';
import { Room } from './room.entity';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
export enum roleEnum{
    유저 = 1,
    관리자 = 2,
    리더 = 3
}
@Entity({ schema: 'apple', name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  // 관계 설정 여기에

  @Column('varchar')
  name: string;

  @Column('varchar')
  email : string

  @Column('varchar', { select: false })
  password: string;

  @CreateDateColumn()
  createAt : Date

  @UpdateDateColumn()
  updatedAt : Date

  @DeleteDateColumn()
  deleteAt : Date | null

  @Column({type : 'enum', enum : roleEnum , default : roleEnum.유저})
  role : roleEnum
}
