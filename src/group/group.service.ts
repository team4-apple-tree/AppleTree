import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { group } from 'console';
import { CreateGroupDto } from 'src/dto/group/create-group.dto';
import { InviteGroupDto } from 'src/dto/group/invite-group.dto';
import { UpdateGroupDto } from 'src/dto/group/update-group.dto';
import { Group } from 'src/entity/group.entity';
import { Member } from 'src/entity/member.entity';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private readonly userService: UserService,
  ) {}

  // 스터디그룹 생성
  async createGroup(data: CreateGroupDto, user: User): Promise<Group> {
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

    return group;
  }

  // 스터디그룹 전체 조회
  async findAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find({
      where: { deletedAt: null },
      select: ['id', 'name', 'image', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  // 스터디그룹 상세 조회
  async findGroup(groupId: number): Promise<Group> {
    return await this.groupRepository.findOne({
      where: { id: groupId, deletedAt: null },
    });
  }

  // 스터디그룹 정보 수정
  async updateGroup(data: UpdateGroupDto, groupId: number): Promise<number> {
    const group = await this.findGroup(groupId);

    if (!group) {
      throw new NotFoundException('해당 스터디그룹을 찾을 수 없습니다.');
    }

    const updateResult = (
      await this.groupRepository.update({ id: groupId }, data)
    ).affected;

    if (!updateResult) {
      throw new NotFoundException('스터디그룹 정보 수정에 실패하였습니다.');
    }

    return updateResult;
  }

  // 스터디그룹 삭제
  async deleteGroup(groupId: number): Promise<number> {
    const deleteResult = (
      await this.groupRepository.softDelete({ id: groupId })
    ).affected;

    if (!deleteResult) {
      throw new NotFoundException('스터디그룹 정보 삭제에 실패하였습니다.');
    }

    return deleteResult;
  }

  // 스터디그룹 멤버 초대
  async inviteMember(data: InviteGroupDto[], groupId: number): Promise<Member> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('해당 스터디그룹을 찾을 수 없습니다.');
    }

    const member = new Member();

    data.forEach(async (item) => {
      const user = await this.userService.findByEmail(item.email);

      member.user = user;
      member.group = group;

      await this.memberRepository.save(member);
    });

    return member;
  }

  // 스터디그룹 멤버 조회
  async findMember(groupId: number): Promise<Group[]> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId, deletedAt: null },
      relations: ['members', 'members.user'],
    });

    let users = [];

    const members = group.members;

    members.forEach((item) => {
      const obj = {};

      obj['role'] = item.role;
      obj['user'] = item.user;

      users.push(obj);
    });

    return users;
  }

  //스터디그룹 멤버 삭제
  async deleteMember(groupId: number, userId: number): Promise<number> {
    // const user = await this.userService.findById(userId);
    // const group = await this.findGroup(groupId);

    // console.log(user);
    // console.log(group);

    // const member = await this.memberRepository.findOne({
    //   where: { user: { id: userId }, group: { id: groupId } },
    //   relations: ['user'],
    // });

    // console.log(member);

    const deleteResult = (
      await this.memberRepository.softDelete({
        user: { id: userId },
        group: { id: groupId },
      })
    ).affected;

    if (!deleteResult) {
      throw new NotFoundException('스터디그룹 멤버 삭제에 실패하였습니다.');
    }

    return deleteResult;
  }
}
