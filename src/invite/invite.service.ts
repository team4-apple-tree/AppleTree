import { Injectable } from '@nestjs/common';
import { InviteDto } from '../dto/invite/invite.dto';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Invitation } from '../entity/invite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly mailerService: MailerService,
  ) {}

  async inviteUser(inviteDto: InviteDto): Promise<void> {
    const { email } = inviteDto;

    // 이미 초대된 이메일 주소인지 확인
    const existingInvitation = await this.invitationRepository.findOne({
      where: { email },
    });
    if (existingInvitation) {
      throw new ConflictException('이미 초대 된 사용자입니다.');
    }

    const invitation = new Invitation();
    invitation.email = email;

    // database 저장
    try {
      await this.invitationRepository.save(invitation);
    } catch (error) {
      throw new InternalServerErrorException(
        '초대 그룹 저장에 실패하였습니다.',
      );
    }

    // 이메일 발송
    try {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.SMTP_USER,
        subject: '초대합니다!',
        text: '스터디 그룹에 참여하세요!',
        html: '<p>우리의 스터디 그룹에 초대합니다~</p>',
      });
    } catch (error) {
      throw new InternalServerErrorException('초대 이메일을 보낼 수 없습니다.');
    }
  }
}
