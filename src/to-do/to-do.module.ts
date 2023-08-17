import { Module } from '@nestjs/common';
import { ToDoController } from './to-do.controller';
import { ToDoService } from './to-do.service';

@Module({
  controllers: [ToDoController],
  providers: [ToDoService]
})
export class ToDoModule {}
