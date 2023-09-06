import {
  Controller,
  Post,
  Body,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteDto } from '../dto/invite/invite.dto';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  async invite(
    @Body() inviteDto: InviteDto,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      await this.inviteService.inviteUser(inviteDto);
      return { success: true };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(`invite 에러 발생: ${error.message}`);
    }
  }
}
