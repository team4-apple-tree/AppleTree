import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository, FindOneOptions } from 'typeorm';
import { Point } from 'src/entity/point.entity';
@Injectable()
export class PaymentService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}
  async createPayment({
    points,
    userId,
  }: {
    points: number;
    userId: number;
  }): Promise<Point> {
    const pointRepository: Repository<Point> =
      this.entityManager.getRepository(Point);
    const existingPoint: Point | undefined = await pointRepository.findOne({
      where: { userId: userId },
    } as FindOneOptions<Point>);
    const payment = { point: points, userId };
    if (!existingPoint) {
      await pointRepository.save(payment);
    }
    // 포인트 업데이트
    existingPoint.point += points;
    // 업데이트된 포인트 정보 저장
    return await pointRepository.save(existingPoint);
  }
}
