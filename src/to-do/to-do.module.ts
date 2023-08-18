import { Module } from '@nestjs/common';
import { TodoController } from './to-do.controller';
import { TodoService } from './to-do.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entity/to-do.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class ToDoModule {}
