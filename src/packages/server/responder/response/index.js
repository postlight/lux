import { Transform } from 'stream';

class Response extends Transform {
  constructor(): Response {
    super({
      encoding: 'utf8',
      writableObjectMode: true
    });

    process.nextTick(() => {
      this.emit('ready', this);
    });

    return this;
  }

  _transform(
    chunk: string | Buffer | Object,
    encoding: string,
    done: () => void
  ): void {
    if (chunk && typeof chunk === 'object') {
      chunk = JSON.stringify(chunk);
    }

    this.push(chunk);

    done(null);
  }
}

export default Response;
