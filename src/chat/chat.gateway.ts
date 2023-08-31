import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MongoClient, MongoClientOptions } from 'mongodb';
import { Injectable, UseGuards } from '@nestjs/common';
import { SocketGuard } from 'src/user/socket.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Access } from 'src/entity/access.entity';
import { Repository, getRepository } from 'typeorm';
import { GroupService } from 'src/group/group.service';
import * as _ from 'lodash';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private mongoClient: MongoClient;

  constructor(
    @InjectRepository(Access) private accessRepository: Repository<Access>,
    private readonly socketGuard: SocketGuard,
    private readonly groupService: GroupService,
  ) {
    const mongoOptions: MongoClientOptions = {};

    this.mongoClient = new MongoClient(
      'mongodb://127.0.0.1:27017/chat_log',
      mongoOptions,
    );
    this.mongoClient.connect();
  }

  async handleConnection(client: any): Promise<void> {
    try {
      const token = client.handshake.headers['authorization'];
      const roomId = client.handshake.headers['roomid'];
      const user = await this.socketGuard.validateToken(token);

      client.join(roomId);

      const group = await this.groupService.findGroup(roomId);

      const roomUser = await this.accessRepository.findOne({
        where: { group: { id: roomId }, user: { id: user.id } },
      });

      if (_.isNil(roomUser)) {
        const access = new Access();

        access.user = user;
        access.group = group;
        access.clientId = client.id;
        access.deletedAt = null;
        await this.accessRepository.save(access);
      }

      const roomUsers = await this.accessRepository.find({
        relations: ['user'],
        where: { group: { id: roomId } },
      });

      const roomUsersName = roomUsers.map((client) => client.user.name);

      this.server.to(roomId).emit('userList', roomUsersName);
    } catch (error) {
      console.error(error);

      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    await this.accessRepository.softDelete({ clientId: client.id });

    const roomId = client.handshake.headers['roomid'];

    const roomUsers = await this.accessRepository.find({
      relations: ['user'],
      where: { group: { id: +roomId } },
    });

    const roomUsersName = roomUsers.map((client) => client.user.name);

    this.server.to(roomId).emit('userList', roomUsersName);
  }

  @SubscribeMessage('chatMessage')
  async handleChatMessage(client: Socket, message: string): Promise<void> {
    const token = client.handshake.headers['authorization'];
    const roomId = client.handshake.headers['roomid'];
    const user = await this.socketGuard.validateToken(token);

    // MongoDB에 채팅 데이터 저장
    const chatCollection = this.mongoClient.db('chat_logs').collection('chats');
    const chatData = {
      roomId: roomId,
      name: user.name,
      message: message,
      timestamp: new Date(),
    };
    chatCollection.insertOne(chatData);

    this.server
      .to(roomId)
      .emit('chatMessage', { userName: user.name, message });
  }
}
