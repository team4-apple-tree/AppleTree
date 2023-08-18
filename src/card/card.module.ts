import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../entity/card.entity';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { ToDoModule } from '../to-do/to-do.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), forwardRef(() => ToDoModule)],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
