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
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Member } from './member.entity';
@Entity({ schema: 'apple', name: 'group' })
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  desc: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.groups)
  user: User;

  @OneToMany(() => Member, (member) => member.group)
  members: Member[];

  // @ManyToMany(() => User, (user) => user.myGroups)
  // @JoinTable({ name: 'group_member' })
  // members: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;
}
