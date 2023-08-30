export class DragonAlreadyDeadError extends Error {
  public readonly type = 'DragonAlreadyDeadError' as const;
  constructor(dragonId: number) {
    super(`Dragon with id ${dragonId} is already dead.`);
  }
}
