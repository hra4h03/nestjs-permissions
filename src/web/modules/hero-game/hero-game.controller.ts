import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { GetHeroResponseDto } from '@/web/dtos/hero-game/hero.dto';
import { GetDragonDto } from '@/web/dtos/hero-game/dragon.dto';
import { HeroGameService } from '@/web/modules/hero-game/hero-game.service';
import { KillDragonRequest } from '@/web/dtos/hero-game/kill-dragon.request.dto';
import { CreateDragon } from '@/web/dtos/hero-game/dragon/create.dragon';
import { RequestWithUser } from '@/auth/guards/JwtGuard';
import { CurrentUser } from '@/auth/guards/CurrentUser';
import { CheckPolicies } from '@/web/common/guards/PoliciesMetadata';
import { Serialize } from '@/web/common/interceptors/serialize.interceptor';
import { catchError } from 'rxjs';
import { ApiController } from '@/web/base.controller';

// @UseGuards(JwtGuard, PoliciesGuard)
@Controller('hero-game')
export class HeroGameController extends ApiController {
  constructor(private readonly heroGameService: HeroGameService) {
    super();
  }

  @Get('/heroes')
  @Serialize(GetHeroResponseDto)
  @ApiOkResponse({ type: [GetHeroResponseDto] })
  getHeroes() {
    return this.heroGameService.getHeroes();
  }

  @Get('/top-heroes')
  @Serialize(GetHeroResponseDto)
  @ApiOkResponse({ type: [GetHeroResponseDto] })
  getTopNRanked(@Query('number', ParseIntPipe) number: number) {
    return this.heroGameService.getTopNRanked(number);
  }

  @Get('/dragons')
  @ApiOkResponse({ type: [GetDragonDto] })
  @Serialize(GetDragonDto)
  @CheckPolicies((ability) => ability.can('read', 'dragon'))
  getDragons(@CurrentUser() user: RequestWithUser['user']) {
    return this.heroGameService.getDragons();
  }

  @Post('/create-dragon')
  @ApiBody({ schema: CreateDragon.OpenApi })
  @ApiOkResponse({ type: GetDragonDto })
  @Serialize(GetDragonDto)
  createDragon(@Body() createDragonDto: CreateDragon.Dto) {
    return this.heroGameService.createDragon(createDragonDto);
  }

  @Post('/kill-dragons')
  @ApiOkResponse({ type: Boolean })
  @ApiBody({ schema: KillDragonRequest.OpenApi })
  async killDragon(@Body() killDragonRequestDto: KillDragonRequest.Dto) {
    return this.heroGameService
      .killDragon(killDragonRequestDto.heroId, killDragonRequestDto.dragonId)
      .pipe(
        catchError((error) => {
          return this.wrapError(error);
        }),
      );
  }
}
