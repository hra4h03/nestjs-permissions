import { UnauthorizedException } from '@nestjs/common';

export class UsernameOrPasswordIsNotCorrect extends UnauthorizedException {
  constructor() {
    super('Username or password may be incorrect. Please try again');
  }
}
