import { parse as parseQueryString } from 'querystring';

export default function bodyParser(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    const onData = data => {
      body += data.toString();
    };

    const onEnd = () => {
      body = (req.headers['content-type'] || '').includes('json') ?
        JSON.parse(body) : parseQueryString(body);

      cleanUp();
      resolve(body);
    };

    const onError = err => {
      cleanUp();
      reject(err);
    };

    const cleanUp = () => {
      req.removeListener('end', onEnd);
      req.removeListener('data', onData);
      req.removeListener('error', onError);
    };

    req.on('data', onData);
    req.once('end', onEnd);
    req.once('error', onError);
  });
}
