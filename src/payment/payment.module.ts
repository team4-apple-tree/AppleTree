import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entity/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentGateway } from './payment.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService, PaymentGateway],
  controllers: [PaymentController],
})
export class PaymentModule {}
