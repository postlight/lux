// @flow
import entries from '../../../utils/entries';
import type { ObjectMap } from '../../../interfaces';

type ChangeType = 'SET' | 'DELETE';
type ChangeData = [string, void | string];
type HandleChange = (type: ChangeType, data: ChangeData) => void;

class Headers extends Map<string, string> {
  constructor(value: ObjectMap) {
    super(entries(value));
  }

  get(key: string): void | string {
    return super.get(String(key).toLowerCase());
  }

  has(key: string): boolean {
    return super.has(String(key).toLowerCase());
  }

  set(key: string, value: string): this {
    super.set(String(key).toLowerCase(), value);
    return this;
  }

  delete(key: string): boolean {
    return super.delete(String(key).toLowerCase());
  }
}

export class RequestHeaders extends Headers {
  writable: boolean;

  constructor(value: ObjectMap) {
    super(value);
    this.writable = false;
  }

  set(key: string, value: string): this {
    if (this.writable) {
      super.set(key, value);
    }
    return this;
  }

  delete(key: string): boolean {
    if (this.writable) {
      return super.delete(key);
    }
    return false;
  }
}

Object.defineProperty(RequestHeaders.prototype, 'writable', {
  value: true,
  writable: true,
  enumerable: false,
  configurable: false,
});

export class ResponseHeaders extends Headers {
  handleChange: HandleChange;

  constructor(handleChange: HandleChange) {
    super({});
    this.handleChange = handleChange;
  }

  set(key: string, value: string): this {
    this.handleChange('SET', [key, value]);
    return super.set(key, value);
  }

  delete(key: string): boolean {
    this.handleChange('DELETE', [key]);
    return super.delete(key);
  }
}

Object.defineProperty(ResponseHeaders.prototype, 'handleChange', {
  writable: true,
  enumerable: false,
  configurable: false,
});
