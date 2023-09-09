import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
import { Access } from 'src/entity/access.entity';
import { UploadService } from 'src/upload.service';
import { EntityManager, DataSource } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(Access) private accessRepository: Repository<Access>,

    private readonly userService: UserService,
    private readonly uploadService: UploadService,
    private readonly entityManager: EntityManager,
    private readonly dataSource: DataSource,
    private readonly mailerService: MailerService,
  ) {}

  async addUserToGroup(user: User, group: Group): Promise<Member> {
    const member = new Member();
    member.user = user;
    member.group = group;
    member.createdAt = new Date();

    return this.memberRepository.save(member);
  }

  // 스터디그룹 생성
  async createGroup(
    data: Omit<CreateGroupDto, 'image'>,
    image: string,
    user: User,
    videoChatURL: string,
  ): Promise<void> {
    if (data.isPassword && data.password) {
      data.isPassword = true;
    } else {
      data.isPassword = false;
      data.password = null;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const isPublic = String(data.isPublic) === 'true';

      const newGroup = this.groupRepository.create({
        ...data,
        isPublic,
        image,
        user,
        videoChatURL, // 여기에 videoChatURL을 추가
      });

      const group = await this.entityManager.save(Group, newGroup);

      const member = new Member();
      member.user = user;
      member.group = group;
      member.role = 1;

      await this.entityManager.save(Member, member);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // 트랜잭션 릴리즈
      await queryRunner.release();
    }
  }

  // 공개 스터디 전체 조회
  async findAllGroups(): Promise<Group[]> {
    return await this.groupRepository.find({
      where: { isPublic: true },
      select: [
        'id',
        'name',
        'image',
        'max',
        'isPublic',
        'isPassword',
        'count',
        'createdAt',
        'updatedAt',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  // 스터디그룹 정보 조회
  async findGroupInfo(groupId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      select: ['id', 'name', 'desc', 'image', 'max', 'startDate', 'endDate'],
    });

    if (_.isNil(group)) {
      throw new NotFoundException('해당 스터디그룹을 찾을 수 없습니다.');
    }

    return group;
  }

  //내가 속한 그룹 조회 하기
  // async findMyGroup(userId: number): Promise<Group[]> {
  //   const group = await this.groupRepository.find({
  //     where: { id: userId },
  //     select: ['name'],
  //   });
  //   if (_.isNil(group)) {
  //     throw new NotFoundException('스터디그룹에 먼저 가입하시쥬?쿠쿠루삥뽕');
  //   }
  //   return group;
  // }

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
  ): Promise<Group> {
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

    return await this.findGroup(groupId);
  }

  // 스터디그룹 삭제
  async deleteGroup(groupId: number, user: User): Promise<void> {
    await this.findGroup(groupId);

    const member = await this.memberRepository.findOne({
      where: { user: { id: user.id }, group: { id: groupId } },
      relations: ['user'],
    });

    if (_.isNil(member)) {
      throw new ForbiddenException(
        '해당 스터디그룹을 삭제할 권한이 존재하지 않습니다.',
      );
    }

    if (member.role !== 1) {
      await this.memberRepository.softDelete({
        user: { id: user.id },
        group: { id: groupId },
      });

      return;
    }

    const deleteResult = (
      await this.groupRepository.softDelete({ id: groupId })
    ).affected;

    if (!deleteResult) {
      throw new NotFoundException('스터디그룹 정보 삭제에 실패하였습니다.');
    }
  }

  // 스터디그룹 입장
  async enterGroup(
    groupId: number,
    user: User,
    password?: string,
  ): Promise<void> {
    const group = await this.findGroup(groupId);

    if (group.isPassword && group.password !== password) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    const access = new Access();

    access.user = user;
    access.group = group;
    access.deletedAt = null;

    try {
      await this.accessRepository.save(access);
    } catch (error) {
      throw new ConflictException('이미 해당 스터디그룹에 접속해 있습니다.');
    }
  }

  // 스터디그룹 퇴장
  async exitGroup(groupId: number, userId: number) {
    await this.findGroup(groupId);

    await this.accessRepository.softDelete({
      user: { id: userId },
      group: { id: groupId },
    });
  }

  // 스터디그룹 멤버 초대
  async inviteMember(data: InviteGroupDto[], groupId: number): Promise<void> {
    const group = await this.findGroup(groupId);

    for (const item of data) {
      const user = await this.userService.findByEmail(item.email);

      if (_.isNil(user)) {
        throw new NotFoundException(
          `${item.email}: 존재하지 않는 이메일입니다.`,
        );
      }

      const member = new Member();

      member.user = user;
      member.group = group;

      try {
        await this.memberRepository.save(member);
      } catch (error) {
        throw new ConflictException(
          `${item.email}은 이미 해당 스터디그룹에 초대되었습니다.`,
        );
      }

      try {
        await this.mailerService.sendMail({
          to: item.email,
          from: process.env.SMTP_USER,
          subject: '초대합니다!',
          text: '스터디 그룹에 참여하세요!',
          html: '<p>우리의 스터디 그룹에 초대합니다~</p>',
        });
      } catch (error) {
        throw new InternalServerErrorException(
          '초대 이메일을 보낼 수 없습니다.',
        );
      }
    }
  }

  // 스터디그룹 접속해 있는 유저 조회
  async findMAccess(groupId: number): Promise<Access[]> {
    await this.findGroup(groupId);

    const access = await this.accessRepository.find({
      where: { group: { id: groupId } },
      relations: ['user'],
    });

    return access;
  }

  // 스터디그룹 접속해 있는 유저 추방
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

    const invitedUser = await this.accessRepository.findOne({
      where: { user: { id: userId }, group: { id: groupId } },
    });

    if (_.isNil(invitedUser)) {
      throw new NotFoundException(
        '해당 유저는 스터디그룹에 존재하지 않습니다.',
      );
    }

    const deleteResult = (
      await this.accessRepository.softDelete({
        user: { id: userId },
        group: { id: groupId },
      })
    ).affected;

    if (!deleteResult) {
      throw new NotFoundException('스터디그룹 멤버 삭제에 실패하였습니다.');
    }
  }

  async verifyPassword(
    groupId: number,
    password: string,
  ): Promise<{ success: boolean }> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });
    if (group && group.password === password) {
      return { success: true };
    }
    return { success: false };
  }

  async findOne(groupId: number): Promise<Group> {
    try {
      return await this.groupRepository.findOne({ where: { id: groupId } });
    } catch (error) {
      // ... 에러 처리 로직 ...
    }
  }

  async joinGroup(groupId: number, user: any): Promise<any> {
    // 그룹을 찾는다.
    const group = await this.findOne(groupId);

    // 이미 그룹의 회원인지 확인한다.
    const existingMember = await this.memberRepository.findOne({
      where: { user: user, group: group },
    });
    if (existingMember) {
      throw new ConflictException('You are already a member of this group.');
    }

    // Member 인스턴스를 생성하고 저장한다.
    const member = new Member();
    member.user = user;
    member.group = group;
    member.createdAt = new Date();

    return await this.memberRepository.save(member);
  }

  async isGroupPasswordProtected(groupId: number): Promise<boolean> {
    const group = await this.findOne(groupId);
    if (!group) {
      throw new NotFoundException('Group not found.');
    }
    return group.isPassword;
  }

  // 내가 속한 스터디 그룹 조회
  async findMyGroup(user: User): Promise<Member[]> {
    return await this.memberRepository.find({
      where: { user: { id: user.id } },
      relations: ['group'],
    });
  }

  // 스터디 그룹 인원수 증가
  async plusCount(groupId: number): Promise<void> {
    const group = await this.findGroup(groupId);
    const count = group.count;

    if (count <= group.max) {
      await this.groupRepository.update({ id: groupId }, { count: count + 1 });
    }
  }

  // 스터디 그룹 인원수 감소
  async minusCount(groupId: number): Promise<void> {
    const group = await this.findGroup(groupId);
    const count = group.count;

    if (count >= 1) {
      await this.groupRepository.update({ id: groupId }, { count: count - 1 });
    }
  }
}
