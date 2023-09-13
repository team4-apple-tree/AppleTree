import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import _ from 'lodash';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, roleEnum } from 'src/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CheckEmailDto } from 'src/dto/user/checkEmail.dto';
import { Point } from 'src/entity/point.entity';
import { Reservation } from 'src/entity/reservation.entity';
import { Seat } from 'src/entity/seat.entity';
import { Room } from 'src/entity/room.entity';
import { TimeTable } from 'src/entity/timeTable.entity';
import { UpdateUserDto } from 'src/dto/user/update-user-dto';
import { CheckPasswordDto } from 'src/dto/user/checkPassword.dto';
import { UpdatePasswordDto } from 'src/dto/user/updatePassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Point) private pointRepository: Repository<Point>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(TimeTable)
    private timeTableRepository: Repository<TimeTable>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Seat) // Seat의 Repository를 주입합니다.
    private seatRepository: Repository<Seat>,
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

  // 유저 이름, 한 줄 소개, 이미지수정
  async update(
    user: User,
    data: Omit<UpdateUserDto, 'profileImage'>,
    image?: string,
  ): Promise<boolean> {
    if (image) {
      const updateResult = (
        await this.userRepository.update(
          { id: user.id },
          {
            ...data,
            profileImage: image,
          },
        )
      ).affected;

      if (!updateResult) {
        throw new NotFoundException('유저 정보 수정에 실패하였습니다.');
      }
    } else {
      const updateResult = (
        await this.userRepository.update({ id: user.id }, data)
      ).affected;

      if (!updateResult) {
        throw new NotFoundException('유저 정보 수정에 실패하였습니다.');
      }
    }

    return true;
  }

  // 회원탈퇴
  async deleteUser(user: User): Promise<void> {
    const deleteResult = (await this.userRepository.softDelete({ id: user.id }))
      .affected;

    if (!deleteResult) {
      throw new NotFoundException('회원탈퇴에 실패하였습니다.');
    }
  }

  // 유저 정보 조회
  async getUser(user: User): Promise<Point> {
    const point = await this.pointRepository.findOne({
      where: { userId: user.id },
      select: ['point'],
    });
    return point;
  }

  async getReservation(userId: number) {
    const reservations = await this.reservationRepository.find({
      where: { userId },
      relations: ['seat', 'seat.room', 'timeTable'],
    });

    if (!reservations || reservations.length === 0) {
      throw new NotFoundException('예약 정보가 없습니다.');
    }
    console.log('리저베이션', reservations);
    const formattedReservations = await Promise.all(
      reservations.map(async (reservation) => {
        const room = await this.findRoom(reservation.seatId);
        const seat = await this.seatRepository.findOne({
          where: { seatId: reservation.seatId },
        });
        const timeTable = await this.timeTableRepository.findOne({
          where: { timeTableId: reservation.timeTableId },
        });
        return {
          name: room.name,
          address: room.address,
          type: seat.type,
          price: seat.price,
          timeTable: timeTable.timeSlot,
        };
      }),
    );
    return formattedReservations;
  }

  private async findRoom(seatId: number) {
    const seat = await this.seatRepository.findOne({
      where: { seatId },
      relations: ['room'],
      select: ['room'],
    });
    if (!seat) {
      // seat를 찾지 못한 경우 예외 처리
      throw new NotFoundException(`Seat with ID ${seatId} not found.`);
    }
    return {
      name: seat.room.name,
      address: seat.room.address,
    };
  }

  // 비밀번호 확인
  async checkPassword(user: User, data: CheckPasswordDto): Promise<boolean> {
    const isExistUser = await this.userRepository.findOne({
      where: [{ deleteAt: null }, { id: user.id }],
      select: ['password'],
    });
    if (!isExistUser) {
      throw new NotFoundException('해당 유저가 존재하지않습니다.');
      //(`User not found. userId: ${userId}`);
    }
    const match = await bcrypt.compare(data.password, isExistUser.password);
    if (!match) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return true;
  }

  // 비밀번호 변경
  async updatePassword(user: User, data: UpdatePasswordDto): Promise<void> {
    if (data.password !== data.confirm) {
      throw new NotFoundException('비밀번호가 일치하지 않습니다.');
    }

    const newPassword = await bcrypt.hash(data.password, 10);

    const updatePasswordResult = (
      await this.userRepository.update(
        { id: user.id },
        { password: newPassword },
      )
    ).affected;

    if (!updatePasswordResult) {
      throw new NotFoundException('비밀번호 변경에 실패하였습니다.');
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
