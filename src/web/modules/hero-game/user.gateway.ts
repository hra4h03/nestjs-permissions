import { Logger, OnModuleDestroy } from '@nestjs/common';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisPubSubService } from 'src/web/common/services/redis-pub-sub.service';
import { User } from '@aggregates/user/user.aggregate';

@WebSocketGateway({ transport: ['websocket'] })
// @UseWsJwtAuthGuard()
export class UserGateway implements OnGatewayConnection, OnModuleDestroy {
  @WebSocketServer()
  public server: Server;
  private readonly logger = new Logger(UserGateway.name);

  constructor(private readonly redisPubSubService: RedisPubSubService) {}

  @SubscribeMessage('friend_location_changes')
  // @UseWsJwtAuthGuard()
  public async subscribeToFriendLocationChanges(client: Socket, payload: any) {
    const user: User = (client?.handshake as any)?.user;
    console.log(user);
    this.logger.log(
      `Client subscribed to friend-location-changes: ${client.id}, ${payload}, ${user}`,
    );

    const friendIds = [1, 2, 3]; // temporary

    const redisSub = this.redisPubSubService.getSub();
    redisSub.subscribe(...friendIds.map((id) => `user.${id}`), (err, count) => {
      if (err) this.logger.error(err);
      this.logger.log(`Subscribed to ${count} channels`);
    });

    redisSub.on('message', (channel: string, message) => {
      this.logger.log(`Received message from ${channel}: ${message}`);
    });
  }

  public async handleConnection(client: Socket, ...args: any[]) {
    // new user came online, we need to get his friends ids and subscribe to their events
    console.log(client.handshake);
    this.logger.log(
      `Client connected: ${client.id}, ${args}, ${client.handshake}`,
    );
  }

  public onModuleDestroy() {
    const redisSub = this.redisPubSubService.getSub();
    redisSub.unsubscribe();
  }
}
