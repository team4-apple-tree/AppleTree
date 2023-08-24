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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/user/create-user-dto';
import { LoginUserDto } from '../dto/user/login-user-dto';
import { UpdateUserDto } from '../dto/user/update-user-dto';
import { DeleteUserDto } from '../dto/user/delete-user-dto';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';

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
    return await this.userService.update(userId, data.password, data.role);
  }

  @Delete('/:userId')
  async DeleteUserDto(
    @Param('userId') userId: number,
    @Body() data: DeleteUserDto,
  ) {
    return await this.userService.deleteUser(userId, data.password);
  }
}
