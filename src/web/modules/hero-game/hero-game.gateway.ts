import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { GetDragonDto } from '../../dtos/hero-game/dragon.dto';

@WebSocketGateway({ transport: ['websocket'] })
export class HeroGameGateway {
  @WebSocketServer()
  public server: Server;

  private readonly logger = new Logger(HeroGameGateway.name);

  onDragonKilled(dragon: GetDragonDto) {
    this.server.emit('dragon-killed', dragon);
  }
}
