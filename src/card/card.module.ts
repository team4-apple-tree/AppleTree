import { Module, forwardRef } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../entity/card.entity';
import { TodoService } from '../to-do/to-do.service';
import { ToDoModule } from '../to-do/to-do.module';
import { Todo } from '../entity/to-do.entity'; // TodoRepository 가져오기
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Card, Todo]),
    forwardRef(() => ToDoModule),
    GroupModule,
  ],
  controllers: [CardController],
  providers: [CardService, TodoService],
  exports: [CardService],
})
export class CardModule {}
