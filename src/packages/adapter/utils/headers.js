// @flow
import entries from '../../../utils/entries';

type ChangeType = 'SET' | 'DELETE';
type ChangeData = [string, void | string];
type HandlerChange = (type: ChangeType, data: ChangeData) => void;

class Headers extends Map<string, string> {
  constructor(value: { [key: string]: string }) {
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
  // eslint-disable-next-line no-unused-vars
  set(key: string, value: string): this {
    return this;
  }

  // eslint-disable-next-line no-unused-vars
  delete(key: string): boolean {
    return false;
  }
}

export class ResponseHeaders extends Headers {
  handleChange: HandlerChange;

  constructor(handleChange: HandlerChange) {
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
