import { Result } from 'src/common/primitives/Result';

function shallowEqual(object1: ValueObjectProps, object2: ValueObjectProps) {
  if (object1 === object2) return true;
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

type Primitive = string | boolean | number;
type ValueObjectProps = object | Primitive | Array<ValueObjectProps>;

export abstract class ValueObject<T extends ValueObjectProps> {
  private readonly _props: T;

  protected constructor(props: T) {
    this._props = Object.freeze(props);
  }

  get value() {
    return this._props;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.value === undefined) {
      return false;
    }
    return shallowEqual(this.value, vo.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static create(_value: any): Result<ValueObject<any>> {
    throw new Error('Not implemented');
  }
}
