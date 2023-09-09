import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Payment } from '../entity/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async createPayment(points: number): Promise<Payment> {
    const payment = new Payment();
    payment.points = points;

    return await this.entityManager.save(payment);
  }
}
