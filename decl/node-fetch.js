// @flow
declare module 'node-fetch' {
  declare var exports: (url: string, options?: {
    body?: any;
    referrer?: string;
    integrity?: string;

    mode?:
      | 'cors'
      | 'no-cors'
      | 'same-origin';

    cache?:
      | 'default'
      | 'no-store'
      | 'reload'
      | 'no-cache'
      | 'force-cache'
      | 'only-if-cached';

    method?:
      | 'GET'
      | 'HEAD'
      | 'OPTIONS'
      | 'PATCH'
      | 'POST'
      | 'DELETE';

    headers?: {
      [key: string]: string;
    };

    redirect?:
      | 'follow'
      | 'manual'
      | 'error';

    credentials?:
      | 'omit'
      | 'include'
      | 'same-origin';

    referrerPolicy?:
      | 'no-referrer'
      | 'no-referrer-when-downgrade'
      | 'origin'
      | 'origin-when-cross-origin'
      | 'unsafe-url';
  }) => Promise<{
    status: number;
    headers: Map<string, string>;

    text(): Promise<string>;
    json(): Promise<Object>;
  }>;
}
