import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from 'src/dto/group/create-group.dto';
import { Group } from 'src/entity/group.entity';
import { Request, Response } from 'express';
import { InviteGroupDto } from 'src/dto/group/invite-group.dto';
import { Member } from 'src/entity/member.entity';
import { UpdateGroupDto } from 'src/dto/group/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // 스터디그룹 생성
  @Post()
  async createGroup(
    @Body() data: CreateGroupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = res.locals.user;

    return await this.groupService.createGroup(data, user);
  }

  // 스터디그룹 전체 조회
  @Get()
  async findAllGroups(): Promise<Group[]> {
    return await this.groupService.findAllGroups();
  }

  // 스터디그룹 상세 조회
  @Get(':groupId')
  async findGroup(@Param('groupId') groupId: number): Promise<Group> {
    return await this.groupService.findGroup(groupId);
  }

  // 스터디그룹 정보 수정
  @Put(':groupId')
  async updateGroup(
    @Body() data: UpdateGroupDto,
    @Param('groupId') groupId: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const updateResult = await this.groupService.updateGroup(data, groupId);

      res.json({ message: '스터디그룹 정보가 수정되었습니다.' });
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException('서버 오류');
    }
  }

  // 스터디그룹 삭제
  @Delete(':groupId')
  async deleteGroup(@Param('groupId') groupId: number): Promise<string> {
    await this.groupService.deleteGroup(groupId);

    return '스터디그룹이 삭제되었습니다.';
  }

  // 스터디그룹 멤버 초대
  @Post(':groupId')
  async inviteMember(
    @Body() data: InviteGroupDto[],
    @Param('groupId') groupId: number,
  ): Promise<Member> {
    return await this.groupService.inviteMember(data, groupId);
  }

  // 스터디그룹 멤버 조회
  @Get(':groupId/members')
  async findMember(@Param('groupId') groupId: number): Promise<Group[]> {
    return await this.groupService.findMember(groupId);
  }

  // 스터디그룹 멤버 삭제
  @Delete(':groupId/members/:userId')
  async deleteMember(
    @Param('groupId') groupId: number,
    @Param('userId') userId: number,
  ): Promise<number> {
    return await this.groupService.deleteMember(groupId, userId);
  }
}
