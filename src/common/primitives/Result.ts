export class Result<TValue, TError extends Error = Error> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: TError;
  private _value: TValue;

  private constructor(isSuccess: boolean, error?: TError, value?: TValue) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be 
          successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result 
          needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public unwrap(): TValue {
    if (!this.isSuccess) {
      throw new Error(`Cant retrieve the value from a failed result.`);
    }

    return this._value;
  }

  public unwrapOr(value: TValue): TValue {
    if (!this.isSuccess) return value;

    return this._value;
  }

  public unwrapOrElse(failuseCase: (error: TError) => any) {
    if (!this.isSuccess) {
      return failuseCase(this.error);
    }

    return this._value;
  }

  public static ok<TValue, TError extends Error = Error>(
    value?: TValue,
  ): Result<TValue, TError> {
    return new Result<TValue, TError>(true, null, value);
  }

  public static fail<TValue, TError extends Error = Error>(
    error: TError,
  ): Result<TValue, TError> {
    return new Result<TValue, TError>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}
