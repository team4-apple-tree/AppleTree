import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class PaymentGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('paymentSuccess')
  handlePaymentSuccess(client: Socket, data: any): void {
    // 결제 성공 이벤트 처리
    this.server.emit('paymentSuccess', data);
  }
}
