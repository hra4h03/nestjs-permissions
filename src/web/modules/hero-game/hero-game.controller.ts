import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/guards/CurrentUser';
import { RequestWithUser } from 'src/auth/guards/JwtGuard';
import { ApiController } from 'src/web/base.controller';
import { CheckPolicies } from 'src/web/common/guards/PoliciesMetadata';
import { Serialize } from 'src/web/common/interceptors/serialize.interceptor';
import { GetDragonDto } from 'src/web/dtos/hero-game/dragon.dto';
import { CreateDragon } from 'src/web/dtos/hero-game/dragon/create.dragon';
import { GetHeroResponseDto } from 'src/web/dtos/hero-game/hero.dto';
import { KillDragonRequest } from 'src/web/dtos/hero-game/kill-dragon.request.dto';
import { HeroGameService } from 'src/web/modules/hero-game/hero-game.service';
import { match } from 'ts-pattern';

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
    const result = await this.heroGameService.killDragon(
      killDragonRequestDto.heroId,
      killDragonRequestDto.dragonId,
    );

    if (result.isFailure) {
      return match(result.error)
        .with({ type: 'DragonAlreadyDeadError' }, (error) => {
          const ex = new BadRequestException(error.message, { cause: error });
          return this.wrapError(ex);
        })
        .with({ type: 'NotFoundError' }, (error) => {
          const ex = new NotFoundException(error.message, { cause: error });
          return this.wrapError(ex);
        })
        .exhaustive();
    }

    return result.unwrap();
  }
}
