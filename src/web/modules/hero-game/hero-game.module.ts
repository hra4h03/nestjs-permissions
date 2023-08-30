import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { Hero } from '@aggregates/hero/hero.aggregate';
import { UserGateway } from './user.gateway';
import { HeroGameService } from './hero-game.service';
import { HeroGameController } from './hero-game.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User } from '@aggregates/user/user.aggregate';
import { CommonModule } from 'src/web/common/common.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Hero, Dragon, User]),
    AuthModule,
    CommonModule,
  ],
  providers: [UserGateway, HeroGameService],
  controllers: [HeroGameController],
})
export class HeroGameModule {}
