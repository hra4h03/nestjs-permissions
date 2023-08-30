import { UnauthorizedException } from '@nestjs/common';

export class UsernameOrPasswordIsNotCorrect extends UnauthorizedException {
  public readonly type = 'UsernameOrPasswordIsNotCorrectError' as const;
  constructor() {
    super('Username or password may be incorrect. Please try again');
  }
}
