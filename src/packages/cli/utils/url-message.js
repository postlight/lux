// @flow

export default function urlMessage(): void {
  console.log(`
  You're using a URL in your database config (config/database.js).

  In that case, Lux assumes you don't need to create or drop your database.
  If you'd like to create or drop a database, set up your database config\
 without the url.

  For guidance, see:
  https://github.com/postlight/lux/blob/master/src/packages/database/\
interfaces.js#L17
`
  );
}
