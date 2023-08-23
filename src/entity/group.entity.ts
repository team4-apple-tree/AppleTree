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
import { Access } from './access.entity';
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

  @Column()
  max: number;

  @Column()
  isPublic: boolean;

  @Column()
  isPassword: boolean;

  @Column({ default: null })
  password: string | null;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.groups)
  user: User;

  @OneToMany(() => Member, (member) => member.group)
  members: Member[];

  @OneToMany(() => Access, (access) => access.group)
  access: Access[];
}
