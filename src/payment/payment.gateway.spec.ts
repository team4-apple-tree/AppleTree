import { Test, TestingModule } from '@nestjs/testing';
import { PaymentGateway } from './payment.gateway';
import { PaymentModule } from './payment.module';

describe('PaymentGateway', () => {
  let gateway: PaymentGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PaymentModule],
      providers: [PaymentGateway],
    }).compile();

    gateway = module.get<PaymentGateway>(PaymentGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
