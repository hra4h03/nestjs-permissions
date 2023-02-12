import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsError extends ConflictException {
  constructor(username: string) {
    super(`User with username ${username} already exists`);
  }
}
