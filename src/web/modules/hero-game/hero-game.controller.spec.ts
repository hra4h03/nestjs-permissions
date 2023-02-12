import { Test, TestingModule } from '@nestjs/testing';
import { HeroGameController } from './hero-game.controller';

describe('HeroGameController', () => {
  let controller: HeroGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroGameController],
    }).compile();

    controller = module.get<HeroGameController>(HeroGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
