import { Module, forwardRef } from '@nestjs/common';
import { TodoController } from './to-do.controller';
import { TodoService } from './to-do.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from '../entity/to-do.entity';
import { CardModule } from '../card/card.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), forwardRef(() => CardModule)],
  controllers: [TodoController],
  providers: [TodoService],
})
export class ToDoModule {}
