import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, roleEnum } from 'src/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CheckEmailDto } from 'src/dto/user/checkEmail.dto';
import { Point } from 'src/entity/point.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Point) private pointRepository: Repository<Point>,
    private jwtService: JwtService,
  ) {}

  // 이메일로 사용자 조회
  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  // ID로 사용자 조회
  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  //추후 고려
  // param이 아닌 방법으로 userId 가져오기
  // accesstoken 이외에 refreshtoken 추가
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ deleteAt: null, email }],
      select: ['id', 'password', 'name'],
    });

    if (!user) {
      throw new UnauthorizedException('로그인!실!패!');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('로그인!실!패!');
    }

    const payload = { id: user.id, name: user.name };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    // return { accessToken, refreshToken };
    return accessToken;
  }

  async signUp(
    email: string,
    name: string,
    password: string,
    confirm: string,
    role: roleEnum,
  ) {
    const user = await this.userRepository.findOne({
      where: { email, deleteAt: null },
      select: ['email'],
    });

    if (user) {
      throw new ConflictException(`해당하는 email이 이미 존재합니다.`);
    }
    if (password !== confirm) {
      throw new UnauthorizedException(`비밀번호가 틀렸습니다.`);
    }

    // 비밀번호 해싱
    const hash = await bcrypt.hash(password, 10);
    password = hash;

    // 사용자 생성
    const insertUser = await this.userRepository.insert({
      email,
      name,
      password,
      role,
    });

    // 사용자의 ID를 사용하여 포인트를 생성하고 초기값 0으로 설정
    const pointData = {
      userId: insertUser.identifiers[0].id,
    };

    await this.pointRepository.insert(pointData);

    // JWT 토큰 생성 및 반환
    const payload = {
      id: insertUser.identifiers[0].id,
      name: insertUser.identifiers[0].name,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }

  // 패스워드 수정 부분이 누락되어있다.
  // 이 부분 추가
  async update(
    userId: number,
    password: string,
    newRole: roleEnum,
    desc: string,
    newPassword: string,
  ) {
    await this.checkPassword(userId, password);
    const hash = await bcrypt.hash(newPassword, 10);
    newPassword = hash;
    return this.userRepository.update(userId, {
      role: newRole,
      desc,
      password: newPassword,
    });
  }

  async deleteUser(userId: number, password: string) {
    await this.checkPassword(userId, password);
    return this.userRepository.softDelete(userId);
  }

  async getUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { deleteAt: null, id: userId },
      select: ['name', 'email', 'role'],
    });
    if (_.isNil(user)) {
      throw new NotFoundException('해당 유저의 정보가 존재하지 않습니다.');
    }
    return user;
  }

  // 밑 로직 userId를 통해 password찾기
  private async checkPassword(userId: number, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ deleteAt: null }, { id: userId }],
      select: ['password'],
    });
    if (!user) {
      throw new NotFoundException('유저가 없지롱~쿠쿠루삥뽕');
      //(`User not found. userId: ${userId}`);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('비밀번호가 틀렸지롱~쿠쿠루삥뽕');
    }
  }
  // 밑 로직 refreshToken 검사
  // refreshToken 기능 구현 중
  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const payload = { id: decoded.id, name: decoded.name };
      const newAccessToken = this.jwtService.sign(payload);

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // 존재하는 이메일인지 확인
  async checkEmail(data: CheckEmailDto): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (_.isNil(user)) {
      return false;
    }

    return true;
  }
}
