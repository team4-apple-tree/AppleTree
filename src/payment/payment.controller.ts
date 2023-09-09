import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto } from '../dto/payment/payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createPayment(@Body() PaymentDto: PaymentDto): Promise<void> {
    await this.paymentService.createPayment(PaymentDto.points);
  }
}
