export class NotFoundError extends Error {
  public readonly type = 'NotFoundError' as const;
  constructor(entity: string, id: number) {
    super(`${entity} with id ${id} is not found.`);
  }
}
