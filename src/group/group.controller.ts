import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from 'src/dto/group/create-group.dto';
import { Group } from 'src/entity/group.entity';
import { Response } from 'express';
import { InviteGroupDto } from 'src/dto/group/invite-group.dto';
import { Member } from 'src/entity/member.entity';
import { UpdateGroupDto } from 'src/dto/group/update-group.dto';
import { Access } from 'src/entity/access.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/aws.service';
import { JwtAuthGuard } from 'src/user/jwt.guard';
import { validate } from 'class-validator';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/user/roles.guard';
import { roleEnum } from 'src/enums/userRoles.enum';
import { VerifyPasswordDto } from 'src/dto/group/VerifyPassword.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Controller('group')
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {}

  // 스터디그룹 생성
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createGroup(
    @Body() data: Omit<CreateGroupDto, 'image'>,
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      const user = await req.user;

      const folderName = 'image';
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
      const apiKey = this.configService.get<string>('DAILY_API_KEY');
      const dailyResponse = await axios.post(
        'https://api.daily.co/v1/rooms',
        {
          name: 'room_' + new Date().getTime(),
          privacy: 'public',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      const videoChatURL = dailyResponse.data.url;

      await this.groupService.createGroup(data, image, user, videoChatURL);

      return { message: '스터디그룹이 생성되었습니다.', videoChatURL };
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('서버 오류');
    }
  }

  // 공개 스터디 전체 조회
  @Get()
  async findAllGroups(): Promise<Group[]> {
    try {
      return await this.groupService.findAllGroups();
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('서버 오류');
    }
  }

  //내가 속한 스터디 조회
  // @Get('/my')
  // @UseGuards(JwtAuthGuard)
  // async findMyGroups(@Req() req: any, userId: number): Promise<Group[]> {
  //   try {
  //     const userId = await req.user.id;
  //     return await this.groupService.findMyGroup(userId);
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException(
  //       '내가 속한 스터디 조회 실패했습니다.',
  //     );
  //   }
  // }

  // 내가 속한 스터디 그룹 조회
  @Get('myGroup')
  @UseGuards(JwtAuthGuard)
  async findMyGroup(@Req() req: any): Promise<Member[]> {
    const user = await req.user;

    return await this.groupService.findMyGroup(user);
  }

  @Post('join/:groupId')
  @UseGuards(JwtAuthGuard)
  async joinGroup(
    @Param('groupId') groupId: number,
    @Body('password') password: string,
    @Req() req: any,
  ): Promise<any> {
    const user = req.user;

    const group = await this.groupService.findOne(groupId);
    if (group.isPassword) {
      if (group.password !== password) {
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }
    }

    await this.groupService.joinGroup(groupId, user);
    return { message: '성공적으로 그룹에 입장했습니다.' };
  }

  // 스터디그룹 정보 조히
  @Get(':groupId/info')
  async findGroupInfo(@Param('groupId') groupId: number): Promise<Group> {
    try {
      return await this.groupService.findGroupInfo(groupId);
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  // 스터디그룹 상세 조회
  @Get(':groupId')
  async findGroup(@Param('groupId') groupId: number): Promise<Group> {
    try {
      return await this.groupService.findGroup(groupId);
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  // 스터디그룹 정보 수정
  @Put(':groupId')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Body() data: UpdateGroupDto,
    @Param('groupId') groupId: number,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Group> {
    try {
      const user = await req.user;

      return await this.groupService.updateGroup(data, groupId, user);
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  // 스터디그룹 삭제
  @Delete(':groupId')
  async deleteGroup(
    @Param('groupId') groupId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const user = res.locals.user;

      await this.groupService.deleteGroup(groupId, user);

      return { message: '스터디그룹이 삭제되었습니다.' };
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  // 스터디그룹 입장
  @Post('/enter/:groupId')
  @UseGuards(JwtAuthGuard)
  async enterGroup(
    @Param('groupId') groupId: number,
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
  ): Promise<any> {
    try {
      const user = await req.user;

      await this.groupService.enterGroup(groupId, user);

      return { message: '접속하였습니다.' };
    } catch (error) {
      console.error(error);

      if (error instanceof ConflictException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  // 스터디그룹 퇴장
  @Delete(':groupId/exit')
  async exitGroup(
    @Param('groupId') groupId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = res.locals.user;

    await this.groupService.exitGroup(groupId, user.id);
  }

  // 스터디그룹 멤버 초대
  @Post(':groupId')
  async inviteMember(
    @Body() data: InviteGroupDto[],
    @Param('groupId') groupId: number,
  ): Promise<any> {
    try {
      await this.groupService.inviteMember(data, groupId);

      return { message: '초대되었습니다.' };
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  // 스터디그룹 접속해 있는 유저 조회
  @Get(':groupId/members')
  async findMAccess(@Param('groupId') groupId: number): Promise<Access[]> {
    try {
      return await this.groupService.findMAccess(groupId);
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  // 스터디그룹 접속해 있는 유저 추방
  @Delete(':groupId/members/:userId')
  async deleteMember(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const user = res.locals.user;

      await this.groupService.deleteMember(groupId, user, userId);

      return { message: '스터디그룹 멤버에서 삭제되었습니다.' };
    } catch (error) {
      console.error(error);

      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new InternalServerErrorException('서버 오류');
      }
    }
  }

  @Get(':groupId/is-password-protected')
  async isGroupPasswordProtected(
    @Param('groupId') groupId: number,
  ): Promise<{ isPassword: boolean }> {
    const isPassword = await this.groupService.isGroupPasswordProtected(
      groupId,
    );
    return { isPassword };
  }

  @Post(':id/verify-password')
  verifyGroupPassword(
    @Param('id') groupId: number,
    @Body() verifyPasswordDto: VerifyPasswordDto,
  ) {
    return this.groupService.verifyPassword(
      groupId,
      verifyPasswordDto.password,
    );
  }
}
