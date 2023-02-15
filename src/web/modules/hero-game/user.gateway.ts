import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { GetDragonDto } from '../../dtos/hero-game/dragon.dto';
import { RedisPubSubService } from '@/web/common/services/redis-pub-sub.service';
import { UseWsJwtAuthGuard } from '@/auth/guards/JwtGuard';
import { CurrentWsUser } from '@/auth/guards/CurrentUser';
import { User } from '@aggregates/user/user.aggregate';

@WebSocketGateway({ transport: ['websocket'] })
@UseWsJwtAuthGuard()
export class UserGateway implements OnGatewayConnection {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly redisPubSubService: RedisPubSubService) {}

  @SubscribeMessage('friend-location-changes')
  public async subscribeToFriendLocationChanges(client: Socket, payload: any) {
    const user: User = (client?.handshake as any)?.user;
    this.logger.log(
      `Client subscribed to friend-location-changes: ${client.id}, ${payload}, ${user?.id}`,
    );
    const friendIds = [1, 2, 3]; // temporary

    const redisSub = this.redisPubSubService.getSub();
    redisSub.subscribe(...friendIds.map((id) => `user.${id}`), (err, count) => {
      if (err) this.logger.error(err);
      this.logger.log(`Subscribed to ${count} channels`);
    });

    redisSub.on('message', (channel: string, message) => {
      // const { event, data } = JSON.parse(message);
      // client.emit(event, data);
      this.logger.log(`Received message from ${channel}: ${message}`);
    });
  }

  public async handleConnection(client: Socket, ...args: any[]) {
    // new user came online, we need to get his friends ids and subscribe to their events
    this.logger.log(`Client connected: ${client.id}, ${args}`);
  }

  private readonly logger = new Logger(UserGateway.name);

  onDragonKilled(dragon: GetDragonDto) {
    this.server.emit('dragon-killed', dragon);
  }
}
