import { Module } from '@nestjs/common';
import { TimeTableService } from './time-table.service';
import { TimeTableController } from './time-table.controller';
import { Seat } from 'src/entity/seat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeTable } from 'src/entity/timeTable.entity';
import { Room } from 'src/entity/room.entity';
import { Reservation } from 'src/entity/reservation.entity';
import { Payment } from 'src/entity/payment.entity';
import { Point } from 'src/entity/point.entity';
import { JwtAuthGuard } from 'src/user/jwt.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seat,TimeTable,Room,Reservation,Payment,Point]),UserModule],
  providers: [TimeTableService, JwtAuthGuard],
  controllers: [TimeTableController]
})
export class TimeTableModule {}
