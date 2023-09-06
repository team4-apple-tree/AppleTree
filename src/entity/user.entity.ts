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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Member } from './member.entity';
import { Board } from './board.entity';
import { Room } from './room.entity';
import { Comment } from './comment.entity';
import { Post } from './post.entity';
import { Group } from './group.entity';
import { Access } from './access.entity';
import { Stopwatch } from './stopwatch.entity';
export enum roleEnum {
  유저 = 1,
  관리자 = 2,
  마스터 = 3,
}
@Entity({ schema: 'apple', name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
  @OneToMany(() => Member, (member) => member.user)
  members: Member[];
  @OneToMany(() => Room, (room) => room.user)
  rooms: Room[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
  @OneToMany(() => Group, (group) => group.user)
  groups: Group[];
  @OneToMany(() => Access, (access) => access.user)
  access: Access[];

  // @ManyToMany(() => Group, (group) => group.members)
  // @JoinTable({ name: 'group_member' })
  // myGroups: Group[];

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

  @OneToMany(() => Stopwatch, (stopwatch) => stopwatch.user)
  stopwatches: Stopwatch[];
}
