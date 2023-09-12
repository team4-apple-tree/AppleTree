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
  UploadedFile,
  UseInterceptors,
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
import { CheckPasswordDto } from 'src/dto/user/checkPassword.dto';
import { UpdatePasswordDto } from 'src/dto/user/updatePassword.dto';
import { S3Service } from 'src/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

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

  // 유저 이름, 한 줄 소개, 이미지 수정
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  async update(
    @Body() data: Omit<UpdateUserDto, 'profileImage'>,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await req.user;

    const folderName = 'user-image';
    const originalName = file.originalname;
    const fileName = `${Date.now()}_${Buffer.from(
      originalName,
      'latin1',
    ).toString('utf8')}`;

    const image = await this.s3Service.uploadImageToS3(
      file,
      folderName,
      fileName,
    );

    return await this.userService.update(user, data, image);
  }

  // 회원탈퇴
  @Delete()
  @UseGuards(JwtAuthGuard)
  async DeleteUserDto(@Req() req: any): Promise<any> {
    const user = await req.user;

    await this.userService.deleteUser(user);

    return { message: '탈퇴되었습니다.' };
  }

  @Get('/out')
  async logout(@Res() response: Response) {
    response.clearCookie('Authorization');
    response.status(200).send('로그아웃 완료');
  }

  // 비밀번호 확인
  @Post('/checkPassword')
  @UseGuards(JwtAuthGuard)
  async checkPassword(
    @Body() data: CheckPasswordDto,
    @Req() req: any,
  ): Promise<boolean> {
    const user = await req.user;

    return await this.userService.checkPassword(user, data);
  }

  // 비밀번호 변경
  @Put('/updatePassword')
  @UseGuards(JwtAuthGuard)
  async updatePassword(
    @Body() data: UpdatePasswordDto,
    @Req() req: any,
  ): Promise<any> {
    const user = await req.user;

    await this.userService.updatePassword(user, data);

    return { message: '비밀번호가 변경되었습니다.' };
  }

  // 로그인 여부 확인
  @Get('/isLogin')
  @UseGuards(JwtAuthGuard)
  async isLogin() {
    return true;
  }

  // 존재하는 이메일인지 확인
  @Post('/checkEmail')
  async checkEmail(@Body() data: CheckEmailDto): Promise<boolean> {
    console.log(data);
    return await this.userService.checkEmail(data);
  }

  // 유저 정보 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  async getCustomRepositoryToken(@Req() req: any): Promise<any> {
    const user = await req.user;
    const point = await this.userService.getUser(user);

    return { user, point };
  }

  //Get user로 얻어올 정보 이름, 이메일, 한마디
}
