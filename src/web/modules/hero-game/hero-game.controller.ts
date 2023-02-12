import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { GetHeroResponseDto } from '@/web/dtos/hero-game/hero.dto';
import { GetDragonDto } from '@/web/dtos/hero-game/dragon.dto';
import { HeroGameService } from '@/web/modules/hero-game/hero-game.service';
import { KillDragonRequest } from '@/web/dtos/hero-game/kill-dragon.request.dto';
import { CreateDragon } from '@/web/dtos/hero-game/dragon/create.dragon';
import { JwtGuard, RequestWithUser } from '@/auth/guards/JwtGuard';
import { CurrentUser } from '@/auth/guards/CurrentUser';
import { CheckPolicies } from '@/web/common/guards/PoliciesMetadata';
import { PoliciesGuard } from '@/web/common/guards/PoliciesGuard';

@UseGuards(JwtGuard, PoliciesGuard)
@Controller('hero-game')
export class HeroGameController {
  constructor(private readonly heroGameService: HeroGameService) {}

  @Get('/heroes')
  @ApiOkResponse({ type: [GetHeroResponseDto] })
  async getHeroes() {
    return this.heroGameService.getHeroes();
  }

  @Get('/dragons')
  @ApiOkResponse({ type: [GetDragonDto] })
  @CheckPolicies((ability) => ability.can('read', 'dragon'))
  getDragons(@CurrentUser() user: RequestWithUser['user']) {
    return this.heroGameService.getDragons();
  }

  @Post('/create-dragon')
  @ApiBody({ schema: CreateDragon.OpenApi })
  @ApiOkResponse({ type: GetDragonDto })
  createDragon(@Body() createDragonDto: CreateDragon.Dto) {
    return this.heroGameService.createDragon(createDragonDto).pipe();
  }

  @Post('/kill-dragon')
  @ApiOkResponse({ type: Boolean })
  @ApiBody({ schema: KillDragonRequest.OpenApi })
  async killDragon(@Body() killDragonRequestDto: KillDragonRequest.Dto) {
    return this.heroGameService.killDragon(
      killDragonRequestDto.heroId,
      killDragonRequestDto.dragonId,
    );
  }
}
