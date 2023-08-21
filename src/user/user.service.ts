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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

    return { accessToken, refreshToken };
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
      throw new ConflictException(`해당하는 email이 이미 있지롱`);
    }
    if (password !== confirm) {
      throw new UnauthorizedException(`패스워드가 틀렸지롱`);
    }
    const hash = await bcrypt.hash(password, 10);
    password = hash;
    const insertUser = await this.userRepository.insert({
      email,
      name,
      password,
      role,
    });
    const payload = {
      id: insertUser.identifiers[0].id,
      name: insertUser.identifiers[0].name,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async update(userId: number, password: string, newRole: roleEnum) {
    await this.checkPassword(userId, password);
    return this.userRepository.update(userId, { role: newRole });
  }

  async deleteUser(userId: number, password: string) {
    await this.checkPassword(userId, password);
    return this.userRepository.softDelete(userId);
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
    if (user.password !== password) {
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
}
