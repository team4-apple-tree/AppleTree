import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, MongoClientOptions } from 'mongodb';

@Injectable()
export class ChatService {
  private mongoClient: MongoClient;

  constructor(private readonly configService: ConfigService) {
    const mongoOptions: MongoClientOptions = {};

    this.mongoClient = new MongoClient(
      this.configService.get<string>('MONGODB_ATLAS'),
      mongoOptions,
    );
  }

  async findChatList(groupId: number): Promise<any> {
    const chatCollection = this.mongoClient.db('chat_logs').collection('chats');

    const chatList = await chatCollection
      .find({ roomId: String(groupId) })
      .toArray();

    return chatList;
  }
}
