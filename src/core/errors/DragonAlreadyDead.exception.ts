import { HttpException, HttpStatus } from '@nestjs/common';

export class DragonAlreadyDeadException extends HttpException {
  constructor(dragonId: number) {
    super(
      `Dragon with id ${dragonId} is already dead.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
