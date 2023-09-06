import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  Res,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/user/create-user-dto';
import { LoginUserDto } from '../dto/user/login-user-dto';
import { UpdateUserDto } from '../dto/user/update-user-dto';
import { DeleteUserDto } from '../dto/user/delete-user-dto';
import * as cookieParser from 'cookie-parser';
import { Request, Response, response } from 'express';
import { JwtAuthGuard } from './jwt.guard';
import { CheckEmailDto } from 'src/dto/user/checkEmail.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign')
  async signUp(@Body() data: CreateUserDto) {
    return await this.userService.signUp(
      data.email,
      data.name,
      data.password,
      data.confirm,
      data.role,
      // data.desc
    );
  }

  @Post('/login')
  async login(
    @Body() data: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authorization = await this.userService.login(
      data.email,
      data.password,
    );
    console.log(authorization);
    response.cookie('Authorization', `Bearer ${authorization}`);
  }

  @Put('/:userId')
  async update(@Param('userId') userId: number, @Body() data: UpdateUserDto) {
    return await this.userService.update(
      userId,
      data.password,
      data.role,
      data.desc,
      data.newPassword,
    );
  }

  @Delete('/:userId')
  async DeleteUserDto(
    @Param('userId') userId: number,
    @Body() data: DeleteUserDto,
  ) {
    return await this.userService.deleteUser(userId, data.password);
  }

  @Get('/out')
  async logout(@Res() response: Response) {
    response.clearCookie('Authorization');
    response.status(200).send('로그아웃 완료');
  }

  // 로그인 여부 확인
  @Get('/isLogin')
  @UseGuards(JwtAuthGuard)
  async isLogin() {
    return true;
  }

  // 존재하는 이메일인지 확인
  @Post('checkEmail')
  async checkEmail(@Body() data: CheckEmailDto): Promise<boolean> {
    console.log(data);
    return await this.userService.checkEmail(data);
  }

  @Get('/:userId')
  async getCustomRepositoryToken(@Param('userId') userId: number) {
    return await this.userService.getUser(userId);
  }

  //Get user로 얻어올 정보 이름, 이메일, 한마디
}
