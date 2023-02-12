import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Dragon } from '@aggregates/dragon/dragon.aggregate';
import { Hero } from '@aggregates/hero/hero.aggregate';
import { HeroGameGateway } from './hero-game.gateway';
import { HeroGameService } from './hero-game.service';
import { HeroGameController } from './hero-game.controller';
import { AuthModule } from '@/auth/auth.module';
import { User } from '@aggregates/user/user.aggregate';
import { CommonModule } from '@/web/common/common.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Hero, Dragon, User]),
    AuthModule,
    CommonModule,
  ],
  providers: [HeroGameGateway, HeroGameService],
  controllers: [HeroGameController],
})
export class HeroGameModule {}
