import { Module, forwardRef } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from '../entity/card.entity';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), GroupModule],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService],
})
export class CardModule {}
