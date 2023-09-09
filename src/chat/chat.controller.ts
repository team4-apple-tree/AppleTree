import { Controller, Param, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':groupId')
  async findChatList(@Param('groupId') groupId: number): Promise<any> {
    return await this.chatService.findChatList(groupId);
  }
}
