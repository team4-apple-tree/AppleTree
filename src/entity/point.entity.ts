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

@Entity({ schema: 'apple', name: 'point' })
export class Point {
@PrimaryGeneratedColumn()
pointId: number;

@Column({ default: 0 })
point: number; 

@Column()
userId : number

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;

@DeleteDateColumn()
deletedAt: Date | null;
}