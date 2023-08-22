import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGroupDto } from 'src/dto/group/create-group.dto';
import { InviteGroupDto } from 'src/dto/group/invite-group.dto';
import { UpdateGroupDto } from 'src/dto/group/update-group.dto';
import { Group } from 'src/entity/group.entity';
import { Member } from 'src/entity/member.entity';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import * as _ from 'lodash';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private readonly userService: UserService,
  ) {}

  // 스터디그룹 생성
  async createGroup(data: CreateGroupDto, user: User): Promise<void> {
    const createGroup = this.groupRepository.create({
      name: data.name,
      desc: data.desc,
      image: data.image,
      user,
    });

    const group = await this.groupRepository.save(createGroup);

    const member = new Member();
    member.user = user;
    member.group = group;
    member.role = 1;

    await this.memberRepository.save(member);
  }

  // 스터디그룹 전체 조회
  async findAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find({
      select: ['id', 'name', 'image', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  // 스터디그룹 상세 조회
  async findGroup(groupId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (_.isNil(group)) {
      throw new NotFoundException('해당 스터디그룹을 찾을 수 없습니다.');
    }

    return group;
  }

  // 스터디그룹 정보 수정
  async updateGroup(
    data: UpdateGroupDto,
    groupId: number,
    user: User,
  ): Promise<void> {
    await this.findGroup(groupId);

    const member = await this.memberRepository.findOne({
      where: { user: { id: user.id }, group: { id: groupId } },
    });

    if (_.isNil(member) || member.role !== 1) {
      throw new ForbiddenException(
        '해당 스터디그룹을 수정할 권한이 존재하지 않습니다.',
      );
    }

    const updateResult = (
      await this.groupRepository.update({ id: groupId }, data)
    ).affected;

    if (!updateResult) {
      throw new NotFoundException('스터디그룹 정보 수정에 실패하였습니다.');
    }
  }

  // 스터디그룹 삭제
  async deleteGroup(groupId: number, user: User): Promise<void> {
    await this.findGroup(groupId);

    const member = await this.memberRepository.findOne({
      where: { user: { id: user.id }, group: { id: groupId } },
      relations: ['user'],
    });

    if (_.isNil(member) || member.role !== 1) {
      throw new ForbiddenException(
        '해당 스터디그룹을 수정할 권한이 존재하지 않습니다.',
      );
    }

    const deleteResult = (
      await this.groupRepository.softDelete({ id: groupId })
    ).affected;

    if (!deleteResult) {
      throw new NotFoundException('스터디그룹 정보 삭제에 실패하였습니다.');
    }
  }

  // 스터디그룹 멤버 초대
  async inviteMember(data: InviteGroupDto[], groupId: number): Promise<void> {
    const group = await this.findGroup(groupId);

    const member = new Member();

    for (const item of data) {
      const user = await this.userService.findByEmail(item.email);

      if (_.isNil(user)) {
        throw new NotFoundException(
          `${item.email}: 존재하지 않는 이메일입니다.`,
        );
      }

      member.user = user;
      member.group = group;

      try {
        await this.memberRepository.save(member);
      } catch (error) {
        throw new ConflictException(
          `${item.email}은 이미 해당 스터디그룹에 속해 있습니다.`,
        );
      }
    }
  }

  // 스터디그룹 멤버 조회
  async findMember(groupId: number): Promise<Member[]> {
    await this.findGroup(groupId);

    const member = await this.memberRepository.find({
      where: { group: { id: groupId } },
      relations: ['user'],
    });

    return member;
  }

  //스터디그룹 멤버 삭제
  async deleteMember(
    groupId: number,
    user: User,
    userId: number,
  ): Promise<void> {
    await this.findGroup(groupId);

    const member = await this.memberRepository.findOne({
      where: { user: { id: user.id }, group: { id: groupId } },
      relations: ['user'],
    });

    if (_.isNil(member) || member.role !== 1) {
      throw new ForbiddenException(
        '해당 스터디그룹을 삭제할 권한이 존재하지 않습니다.',
      );
    }

    const isExistUser = await this.userService.findById(userId);

    if (_.isNil(isExistUser)) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }

    const invitedUser = await this.memberRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
    });

    if (_.isNil(invitedUser)) {
      throw new NotFoundException(
        '해당 유저는 스터디그룹에 존재하지 않습니다.',
      );
    }

    const deleteResult = (
      await this.memberRepository.softDelete({
        user: { id: userId },
        group: { id: groupId },
      })
    ).affected;

    if (!deleteResult) {
      throw new NotFoundException('스터디그룹 멤버 삭제에 실패하였습니다.');
    }
  }
}
