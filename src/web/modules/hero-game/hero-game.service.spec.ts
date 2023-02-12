import { Test, TestingModule } from '@nestjs/testing';
import { HeroGameService } from './hero-game.service';

describe('HeroGameService', () => {
  let service: HeroGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeroGameService],
    }).compile();

    service = module.get<HeroGameService>(HeroGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
