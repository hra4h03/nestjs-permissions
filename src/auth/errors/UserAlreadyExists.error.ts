export class UserAlreadyExistsError extends Error {
  public readonly type = 'UserAlreadyExistsError' as const;
  constructor(username: string) {
    super(`User with username ${username} already exists`);
  }
}
