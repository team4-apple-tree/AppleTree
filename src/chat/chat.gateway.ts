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
import { GroupService } from 'src/group/group.service';
import * as _ from 'lodash';
import { Repository, getRepository } from 'typeorm';
import { Access } from 'src/entity/access.entity';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway()
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private mongoClient: MongoClient;
  private messageCache: { [room: string]: any[] } = {};

  constructor(
    @InjectRepository(Access) private accessRepository: Repository<Access>,
    private readonly socketGuard: SocketGuard,
    private readonly groupService: GroupService,
    private readonly configService: ConfigService,
  ) {
    const mongoOptions: MongoClientOptions = {};

    this.mongoClient = new MongoClient(
      this.configService.get<string>('MONGODB_ATLAS'),
      mongoOptions,
    );
    this.mongoClient.connect().then(() => {
      this.setUpScheduler();
      this.flushCacheToMongoDB();
    });
    this.setUpScheduler();
  }

  async handleConnection(client: any): Promise<void> {
    try {
      const token = client.handshake.headers['authorization'];
      const roomId = client.handshake.headers['roomid'];
      const user = await this.socketGuard.validateToken(token);
      let members = [];

      client.userName = user.name;

      client.join(roomId);

      const ids = Array.from(this.server.sockets.adapter.rooms.get(roomId));

      ids.forEach((id) => {
        const name = this.server.sockets.sockets.get(id)['userName'];

        members.push(name);
      });

      members.sort();

      this.server.to(roomId).emit('members', members);

      // const group = await this.groupService.findGroup(roomId);

      // const roomUser = await this.accessRepository.findOne({
      //   where: { group: { id: roomId }, user: { id: user.id } },
      // });

      // if (_.isNil(roomUser)) {
      //   const access = new Access();

      //   access.user = user;
      //   access.group = group;
      //   access.clientId = client.id;
      //   access.deletedAt = null;
      //   await this.accessRepository.save(access);
      // }

      // const roomUsers = await this.accessRepository.find({
      //   relations: ['user'],
      //   where: { group: { id: roomId } },
      // });

      // const roomUsersName = roomUsers.map((client) => client.user.name);

      // this.server.to(roomId).emit('userList', roomUsersName);
      // this.server.to(roomId).emit('enter', user.name);
    } catch (error) {
      console.error(error);

      client.disconnect();
    }
  }
  async handleDisconnect(client: any): Promise<void> {
    const roomId = client.handshake.headers['roomid'];

    client.leave(roomId);

    const isExistIds = this.server.sockets.adapter.rooms.get(roomId);

    if (isExistIds) {
      const ids = Array.from(isExistIds);

      let members = [];

      ids.forEach((id) => {
        const name = this.server.sockets.sockets.get(id)['userName'];

        members.push(name);
      });

      members.sort();

      this.server.to(roomId).emit('members', members);
      // const token = client.handshake.headers['authorization'];
      // const user = await this.socketGuard.validateToken(token);

      // await this.accessRepository.softDelete({ clientId: client.id });

      // const roomUsers = await this.accessRepository.find({
      //   relations: ['user'],
      //   where: { group: { id: +roomId } },
      // });

      // const roomUsersName = roomUsers.map((client) => client.user.name);

      // this.server.to(roomId).emit('userList', roomUsersName);
      // this.server.to(roomId).emit('exit', user.name);
    }
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
    // chatCollection.insertOne(chatData);

    this.server
      .to(roomId)
      .emit('chatMessage', { userName: user.name, message });

    this.cacheMessage(+roomId, chatData); // 캐시에 채팅 데이터 추가
  }

  // 메시지를 캐시에 저장하는 메서드
  private cacheMessage(roomId: number, message: any): void {
    if (!this.messageCache[roomId]) {
      this.messageCache[roomId] = [];
    }
    this.messageCache[roomId].push(message);
  }

  // MongoDB에 채팅 데이터 저장
  private async flushCacheToMongoDB() {
    try {
      // MongoDB에 연결
      const chatCollection = this.mongoClient
        .db('chat_logs')
        .collection('chats');
      // 모든 방의 메시지를 캐시에서 가져와서 MongoDB에 저장
      for (const room of Object.keys(this.messageCache)) {
        const messages = this.messageCache[room];

        if (messages.length > 0) {
          // 캐시된 메시지를 MongoDB에 저장
          await chatCollection.insertMany(messages);
          // 캐시를 비웁니다.
          this.messageCache[room] = [];
          console.log(`Cache flushed to MongoDB for room: ${room}`);
        }
      }
    } catch (error) {
      console.error('Error flushing cache to MongoDB:', error);
    }
  }

  // 스케줄러 설정 메서드
  private setUpScheduler() {
    // 30분마다 flushCacheToMongoDB 메서드를 호출하도록 스케줄러 설정
    setInterval(() => {
      this.flushCacheToMongoDB();
    }, 60 * 1000); // 10분 간격으로 실행 (밀리초 단위)
  }
}
