# Lux Changelog

### 1.0.0-rc.5 (Aug 13, 2016)

This release contains a number of bug fixes as well as some new features. Big shout out to [@adampash](https://github.com/adampash), a new member of the Postlight team. :clap: Awesome job these past 2 weeks!

##### Features

###### Aliased Imports

Previously, you would have to use relative paths for importing modules within the `app` directory. Now, `app` is alias so you can import modules from the `app` directory without having to write out the relative path (`../../../`).

```javascript
import { Controller } from 'lux-framework';

import Post from 'app/models/post';

class PostsController extends Controller {
  show({ params: { id } }) {
    return Post.find(id);
  }
}

export default PostsController;
```

###### CORS Config Options

You now have the ability to setup CORS headers in your config file. These headers are added to the request before it is parsed. Doing so, prevents request that fail before reaching your `ApplicationController` from not having the CORS headers set. This should allow for a more graceful error handling experience on the client.

Here is an example of how you may want to configure CORS for your application:

```javascript
export default {
  server: {
    cors: {
      origin: '*',
      enabled: true,

      headers: [
        'Accept',
        'Content-Type'
      ],

      methods: [
        'GET',
        'POST',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS'
      ]
    }
  },

  logging: {
    level: 'DEBUG',
    format: 'text',
    enabled: true,

    filter: {
      params: [
        'email',
        'password'
      ]
    }
  }
};
```

###### Database Connection Strings

You may now use connection strings to configure your database connection. You may now specify a full config object as we have supported in previous versions, a config object containing `driver` and `url` properties, or a config object containing only the `driver` property if your environment variables contain a `DATABASE_URL`.

The following three examples are equivalent:

*Example A:*

```javascript
// ./config/database.js
export default {
  development: {
    port: 5432,
    host: '127.0.0.1',
    driver: 'pg',
    username: 'postgres',
    password: '********',
    database: 'lux_test'
  }
}
```

*Example B:*

```javascript
// ./config/database.js
export default {
  development: {
    driver: 'pg',
    url: 'postgres://postgres:********@127.0.0.1:5432/lux_test'
  }
}
```

*Example C:*

```bash
# ~/.bash_profile
export DATABASE_URL='postgres://postgres:********@127.0.0.1:5432/lux_test'
```

```javascript
// ./config/database.js
export default {
  development: {
    driver: 'pg'
  }
}
```

###### Default Config

In prior versions, it could be a pain to upgrade due to differing config files based on when you first generated your Lux application. Now, you can have an easier time upgrading as default values for config options are used internally.

##### Commits

* [[`30e3e2e6b9`](https://github.com/postlight/lux/commit/30e3e2e6b9)] - **fix**: id null check fails if using postgres (#308) (Adam Pash)
* [[`d01c27eae5`](https://github.com/postlight/lux/commit/d01c27eae5)] - **feat**: adding support for urls in database config (#307) (Adam Pash)
* [[`bf6a518239`](https://github.com/postlight/lux/commit/bf6a518239)] - **deps**: update eslint to version 3.3.0 (#310) (Greenkeeper)
* [[`fb22a31c8a`](https://github.com/postlight/lux/commit/fb22a31c8a)] - **deps**: update eslint-plugin-flowtype to version 2.6.4 (#305) (Greenkeeper)
* [[`8b416b748b`](https://github.com/postlight/lux/commit/8b416b748b)] - **deps**: update eslint-plugin-flowtype to version 2.6.3 (#303) (Greenkeeper)
* [[`fd1d01ec1b`](https://github.com/postlight/lux/commit/fd1d01ec1b)] - **feat**: added CORS to config (#302) (Adam Pash)
* [[`a04c0fdda9`](https://github.com/postlight/lux/commit/a04c0fdda9)] - **fix**: camel cased relationships do not resolve correctly (#300) (Zachary Golba)
* [[`c90377052f`](https://github.com/postlight/lux/commit/c90377052f)] - **deps**: update eslint-plugin-flowtype to version 2.6.1 (#301) (Greenkeeper)
* [[`386cd24270`](https://github.com/postlight/lux/commit/386cd24270)] - **feat**: setting default configuration (#299) (Adam Pash)
* [[`99b48107d0`](https://github.com/postlight/lux/commit/99b48107d0)] - **deps**: update eslint-plugin-flowtype to version 2.4.1 (#296) (Greenkeeper)
* [[`d11aafc5f8`](https://github.com/postlight/lux/commit/d11aafc5f8)] - **fix**: pad function is failing due to negative values (#295) (Zachary Golba)
* [[`164daec01a`](https://github.com/postlight/lux/commit/164daec01a)] - **fix**: lining up stats in debug logger when ms length differs (#292) (Adam Pash)
* [[`e33f742d0e`](https://github.com/postlight/lux/commit/e33f742d0e)] - **feat**: aliased app dir for easier imports (#293) (Adam Pash)
* [[`14a9cea1f6`](https://github.com/postlight/lux/commit/14a9cea1f6)] - **feat**: added default fallback for CLI (#271) (Adam Pash)
* [[`4ff3f81218`](https://github.com/postlight/lux/commit/4ff3f81218)] - **deps**: update mocha to version 3.0.2 (#291) (Greenkeeper)
* [[`9e658e9daa`](https://github.com/postlight/lux/commit/9e658e9daa)] - **chore**: enable flow on windows (#286) (Zachary Golba)
* [[`cceb67995d`](https://github.com/postlight/lux/commit/cceb67995d)] - **release**: 1.0.0-rc.4 (#285) (Zachary Golba)

### 1.0.0-rc.4 (Aug 7, 2016)

This release contains a fix for a number of bugs introduced in `1.0.0-rc.3`. In addition to bug fixes this release introduces a couple new features.

##### Features

###### Generating Utilities

You can now generate utility functions via the command line!

```bash
$ lux generate util do-something
create app/utils/do-something.js
```

```javascript
// app/utils/do-something.js

export default function doSomething() {

}
```

###### Generating Middleware

You can now generate middleware functions via the command line!

```bash
$ lux generate middleware do-something
create app/middleware/do-something.js
```

```javascript
// app/middleware/do-something.js

export default function doSomething(/*request, response*/) {

}
```

##### Upgrading

Make sure the following directories exist:

- `app/middleware`
- `app/utils`

Also, `1.0.0-rc.3` introduced some changes to config files so make sure that the files in your `config/environments` directory match the following format:

```javascript
// config/environments/development.js

export default {
  logging: {
    level: 'DEBUG',
    format: 'text',
    enabled: true,

    filter: {
      params: []
    }
  }
};
```

```javascript
// config/environments/test.js

export default {
  logging: {
    level: 'WARN',
    format: 'text',
    enabled: false,

    filter: {
      params: []
    }
  }
};
```

```javascript
// config/environments/production.js

export default {
  logging: {
    level: 'INFO',
    format: 'json',
    enabled: true,

    filter: {
      params: []
    }
  }
};
```


##### Commits

* [[`62431679b2`](https://github.com/postlight/lux/commit/62431679b2)] - **deps**: update rollup to version 0.34.7 (#284) (Greenkeeper)
* [[`0c12e8b754`](https://github.com/postlight/lux/commit/0c12e8b754)] - **fix**: indentation is off when using model generators (#281) (Zachary Golba)
* [[`4d89474fce`](https://github.com/postlight/lux/commit/4d89474fce)] - **refactor**: remove bluebird in favor of native apis (#279) (Zachary Golba)
* [[`241ae8993d`](https://github.com/postlight/lux/commit/241ae8993d)] - **refactor**: improve third party type declarations (#276) (Zachary Golba)
* [[`5de7a0d6c3`](https://github.com/postlight/lux/commit/5de7a0d6c3)] - **fix**: empty n:m relationships loads every record instead of an empty array (#277) (Zachary Golba)
* [[`48d2fb7377`](https://github.com/postlight/lux/commit/48d2fb7377)] - **deps**: update rollup to version 0.34.5 (#275) (Greenkeeper)
* [[`6ea44c3aef`](https://github.com/postlight/lux/commit/6ea44c3aef)] - **deps**: update babel-core to version 6.13.2 (#273) (Greenkeeper)
* [[`329309d9ec`](https://github.com/postlight/lux/commit/329309d9ec)] - **fix**: empty 'fields' params cause all keys of a resource to be exposed (#270) (Zachary Golba)
* [[`a412aa7493`](https://github.com/postlight/lux/commit/a412aa7493)] - **deps**: update test-app dependencies (#268) (Zachary Golba)
* [[`35f301c1d8`](https://github.com/postlight/lux/commit/35f301c1d8)] - **deps**: update babel-core to version 6.13.1 (#267) (Greenkeeper)
* [[`d0f4f2bfd3`](https://github.com/postlight/lux/commit/d0f4f2bfd3)] - **Feat**: Added generator for utils (#262) (Adam Pash)
* [[`2ead12a73a`](https://github.com/postlight/lux/commit/2ead12a73a)] - **deps**: update mocha to version 3.0.1 (#265) (Greenkeeper)
* [[`94abf145d1`](https://github.com/postlight/lux/commit/94abf145d1)] - **Feat**: Added generator for middleware (#261) (Adam Pash)
* [[`d9d008111c`](https://github.com/postlight/lux/commit/d9d008111c)] - **release**: 1.0.0-rc.3 (#264) (Zachary Golba)

### 1.0.0-rc.3 (Aug 3, 2016)

Shout out to @adampash for fixing a bug that prevents newly created Lux apps from successfully being built! 👏

##### Notable Changes

* Newly created Lux projects no longer fail to build due to invalid config files.

##### Commits

* [[`6b598748d0`](https://github.com/postlight/lux/commit/6b598748d0)] - **Fix**: Quoting quotes inside config template (#260) (Adam Pash)
* [[`74416748e4`](https://github.com/postlight/lux/commit/74416748e4)] - **release**: 1.0.0-rc.2 (#253) (Zachary Golba)

### 1.0.0-rc.2 (Aug 2, 2016)

##### Notable Changes

* Invalid parameters and malformed request bodies no longer fail silently.
* Controller's now accept relationships for `create` and `update` actions.

##### Commits

* [[`1172d562c5`](https://github.com/postlight/lux/commit/1172d562c5)] - **fix**: do not allow public route definitions to set private params (#252) (Zachary Golba)
* [[`278ab5dda3`](https://github.com/postlight/lux/commit/278ab5dda3)] - **fix**: allow show action to be chained (#251) (Zachary Golba)
* [[`4777e1a22e`](https://github.com/postlight/lux/commit/4777e1a22e)] - **chore**: update example apps (#250) (Zachary Golba)
* [[`5f55d63b57`](https://github.com/postlight/lux/commit/5f55d63b57)] - **deps**: update eslint to version 3.2.2 (#248) (Greenkeeper)
* [[`831a61c7a1`](https://github.com/postlight/lux/commit/831a61c7a1)] - **deps**: update rollup to version 0.34.3 (#249) (Greenkeeper)
* [[`e49e7df0e6`](https://github.com/postlight/lux/commit/e49e7df0e6)] - **deps**: update all dependencies (#247) (Zachary Golba)
* [[`f41007d873`](https://github.com/postlight/lux/commit/f41007d873)] - **deps**: update eslint to version 3.2.1 (#245) (Greenkeeper)
* [[`62ee4be098`](https://github.com/postlight/lux/commit/62ee4be098)] - **deps**: update rollup-plugin-multi-entry to version 2.0.1 (#246) (Greenkeeper)
* [[`32aa4484d0`](https://github.com/postlight/lux/commit/32aa4484d0)] - **deps**: update rollup to version 0.34.2 (#244) (Greenkeeper)
* [[`82fb3ce32e`](https://github.com/postlight/lux/commit/82fb3ce32e)] - **deps**: update mocha to version 3.0.0 (#243) (Greenkeeper)
* [[`e4de52d116`](https://github.com/postlight/lux/commit/e4de52d116)] - **refactor**: add better relationship support and refactor type systems (#229) (Zachary Golba)
* [[`e5e4c7afde`](https://github.com/postlight/lux/commit/e5e4c7afde)] - **deps**: update rollup-plugin-node-resolve to version 2.0.0 (#242) (Greenkeeper)
* [[`edefdb50be`](https://github.com/postlight/lux/commit/edefdb50be)] - **deps**: update rollup-plugin-node-resolve to version 1.7.3 (#241) (Greenkeeper)
* [[`2d35a05c43`](https://github.com/postlight/lux/commit/2d35a05c43)] - **deps**: update ora to version 0.3.0 (#239) (Greenkeeper)
* [[`6787f15135`](https://github.com/postlight/lux/commit/6787f15135)] - **deps**: update eslint to version 3.2.0 (#237) (Greenkeeper)
* [[`aab024dc10`](https://github.com/postlight/lux/commit/aab024dc10)] - **deps**: update flow-bin to version 0.30.0 (#238) (Greenkeeper)
* [[`4fcf1fcb54`](https://github.com/postlight/lux/commit/4fcf1fcb54)] - **deps**: update rollup-plugin-node-resolve to version 1.7.2 (#236) (Greenkeeper)
* [[`dff620b617`](https://github.com/postlight/lux/commit/dff620b617)] - **deps**: update eslint-plugin-flowtype to version 2.4.0 (#235) (Greenkeeper)
* [[`c1e1d69956`](https://github.com/postlight/lux/commit/c1e1d69956)] - **deps**: update babel-plugin-transform-es2015-modules-commonjs to version 6.11.5 (#234) (Greenkeeper)
* [[`8c2494cd4b`](https://github.com/postlight/lux/commit/8c2494cd4b)] - **deps**: update babel-core to version 6.11.4 (#233) (Greenkeeper)
* [[`7682b8720a`](https://github.com/postlight/lux/commit/7682b8720a)] - **deps**: update eslint to version 3.1.1 (#231) (Greenkeeper)
* [[`6b62779f27`](https://github.com/postlight/lux/commit/6b62779f27)] - **fix**: pluralize fields resource name (#216) (Louis Person)
* [[`44025b35f7`](https://github.com/postlight/lux/commit/44025b35f7)] - **deps**: update documentation (package) to version 4.0.0-beta8 (#228) (Zachary Golba)
* [[`ef8a1f6e22`](https://github.com/postlight/lux/commit/ef8a1f6e22)] - **deps**: update pg to version 6.0.2 in test-app (#227) (Zachary Golba)
* [[`4247194886`](https://github.com/postlight/lux/commit/4247194886)] - **feat**: deduce domain protocol from connection (#217) (Louis Person)
* [[`cb5e45d342`](https://github.com/postlight/lux/commit/cb5e45d342)] - **deps**: update eslint to version 3.1.0 (#226) (Greenkeeper)
* [[`d8ef797d46`](https://github.com/postlight/lux/commit/d8ef797d46)] - **refactor**: remove response stream in favor of res.end() (#225) (Zachary Golba)
* [[`a8a5406995`](https://github.com/postlight/lux/commit/a8a5406995)] - **feat**: improve log messages and data (#213) (Zachary Golba)
* [[`6cd3474a53`](https://github.com/postlight/lux/commit/6cd3474a53)] - **deps**: update flow-bin to version 0.29.0 (#224) (Greenkeeper)
* [[`2960a4148a`](https://github.com/postlight/lux/commit/2960a4148a)] - **deps**: update source-map-support to version 0.4.2 (#220) (Greenkeeper)
* [[`c06a677c81`](https://github.com/postlight/lux/commit/c06a677c81)] - **deps**: update eslint-plugin-flowtype to version 2.3.1 (#219) (Greenkeeper)
* [[`e69f04f6d9`](https://github.com/postlight/lux/commit/e69f04f6d9)] - **feat**: check directory for valid directory structure (#215) (kev5873)
* [[`a7960f6bea`](https://github.com/postlight/lux/commit/a7960f6bea)] - **deps**: update rollup to version 0.34.1 (#214) (Greenkeeper)
* [[`9c7e24a6dd`](https://github.com/postlight/lux/commit/9c7e24a6dd)] - **refactor**: add flow comment to the top of decl files (#212) (Zachary Golba)
* [[`fc325ea65b`](https://github.com/postlight/lux/commit/fc325ea65b)] - **refactor**: improve and simplify eslint rules (#209) (Zachary Golba)
* [[`a8460e5d4c`](https://github.com/postlight/lux/commit/a8460e5d4c)] - **fix**: resource IDs must be strings (#211) (Louis Person)
* [[`fd0a593bb1`](https://github.com/postlight/lux/commit/fd0a593bb1)] - **deps**: update rollup to version 0.34.0 (#210) (Greenkeeper)
* [[`4cc248bed4`](https://github.com/postlight/lux/commit/4cc248bed4)] - **deps**: update test-app dependencies (#208) (Zachary Golba)
* [[`81a30f76b9`](https://github.com/postlight/lux/commit/81a30f76b9)] - **feat**: improve proxy decl (#207) (Zachary Golba)
* [[`99523b7a0d`](https://github.com/postlight/lux/commit/99523b7a0d)] - **deps**: update babel-eslint to version 6.1.2 (#206) (Greenkeeper)
* [[`eca77d5e9f`](https://github.com/postlight/lux/commit/eca77d5e9f)] - **deps**: update rollup to version 0.33.2 (#205) (Greenkeeper)
* [[`4bb1878b91`](https://github.com/postlight/lux/commit/4bb1878b91)] - **deps**: update babel-eslint to version 6.1.1 (#204) (Greenkeeper)
* [[`3bb6e07431`](https://github.com/postlight/lux/commit/3bb6e07431)] - **fix**: errors is a top level member (#203) (Louis Person)
* [[`370630c8d4`](https://github.com/postlight/lux/commit/370630c8d4)] - **deps**: update rollup to version 0.33.1 (#202) (Greenkeeper)
* [[`3eb6790091`](https://github.com/postlight/lux/commit/3eb6790091)] - **deps**: update rollup-plugin-multi-entry to version 2.0.0 🚀 (#199) (Greenkeeper)
* [[`dc2e232b94`](https://github.com/postlight/lux/commit/dc2e232b94)] - **deps**: update flow-bin to version 0.28.0 🚀 (#201) (Greenkeeper)
* [[`000bf415a2`](https://github.com/postlight/lux/commit/000bf415a2)] - **deps**: update eslint to version 3.0.1 (#200) (Greenkeeper)
* [[`14b7bab46c`](https://github.com/postlight/lux/commit/14b7bab46c)] - **docs**: update CHANGELOG.md to include docker images (#198) (Zachary Golba)
* [[`236c3961f0`](https://github.com/postlight/lux/commit/236c3961f0)] - **docs**: update ROADMAP.md (#197) (Zachary Golba)
* [[`1d3a7b29ae`](https://github.com/postlight/lux/commit/1d3a7b29ae)] - **docs**: update testing section of README.md (#196) (Zachary Golba)
* [[`266b2120a2`](https://github.com/postlight/lux/commit/266b2120a2)] - **release**: 1.0.0-rc.1 (#195) (Zachary Golba)

### 1.0.0-rc.1 (July 4, 2016)

Happy Independence Day 🇺🇸

This release brings a few bug fixes and some of the features tracked in the [1.0 milestone](https://github.com/postlight/lux/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0). Special thanks to @kev5873 for finding and fixing a bug related to generating a new project with more than one dash in the title!

##### Features

###### Docker Images

🐳 We now have images on Docker Hub for seamless Lux development and deploying.

* [Docker Hub](https://hub.docker.com/r/zacharygolba/lux-framework)
* [GitHub](https://github.com/postlight/docker-lux)

###### `Query#first` & `Query#last`

You are now able to query for a single record similar to `Query#find` but with all chainable query methods rather than just `WHERE 'id' = ?`.

*Async/Await*
```javascript
const post = await Post
  .first()
  .where({ isPublic: true });

console.log(post);
// => Post {}
```

*Promise*
```javascript
Post
  .first()
  .where({ isPublic: true })
  .then(post => console.log(post));
// => Post {}
```


###### `Model#relationship` => `Promise`

Models now return a `Promise` when accessing a relationship. If the related record have been eager loaded with includes it will immediately resolve to the eager loaded value. Otherwise, it will load the related records from the database and resolve with the result.

*Async/Await*
```javascript
const post = await Post.find(1);

console.log(await post.author);
// => Author {}
```

*Promise*
```javascript
Post.find(1)
  .then(post => post.author)
  .then(author => console.log(author));
// => Author {}
```

##### Commits

* [[`32c1b92d04`](https://github.com/postlight/lux/commit/32c1b92d04)] - **deps**: update moment to version 2.14.1 (#194) (Greenkeeper)
* [[`e43e2e6c00`](https://github.com/postlight/lux/commit/e43e2e6c00)] - **deps**: update eslint to version 3.0.0 (#192) (Greenkeeper)
* [[`40863b4fbd`](https://github.com/postlight/lux/commit/40863b4fbd)] - **fix**: display correct error messages from flow script (#191) (Zachary Golba)
* [[`5aeb903196`](https://github.com/postlight/lux/commit/5aeb903196)] - **feat**: return a promise from relationships (#190) (Zachary Golba)
* [[`38d7a9bcbf`](https://github.com/postlight/lux/commit/38d7a9bcbf)] - **feat**: add Query#first and Query#last (#189) (Zachary Golba)
* [[`bceb825976`](https://github.com/postlight/lux/commit/bceb825976)] - **fix**: fixes #187 issue with class name generation with multiple dashes (#188) (kev5873)
* [[`620ab46eae`](https://github.com/postlight/lux/commit/620ab46eae)] - **chore(package)**: update source-map-support to version 0.4.1 (#186) (Greenkeeper)
* [[`22dfbaf03b`](https://github.com/postlight/lux/commit/22dfbaf03b)] - **release**: 1.0.0-rc (#185) (Zachary Golba)

### 1.0.0-rc (June 25, 2016)

🔅🎊🎈 This is the final set of functionality that will be added in 1.0! The remainder of pull requests from now until the 1.0 release will just be bug fixes or adding polish (Dockerfile, Website, Quick Start Guide, API docs, etc.). These issues can be tracked in the [1.0 milestone](https://github.com/postlight/lux/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0).

In addition to features, this release includes bug fixes and general performance improvements.

##### Features

###### Lux Console

You can now debug your application rails style with a custom repl that has your application built and loaded as global variables.

To start the repl, run `lux console` or `lux c` in your

```javascript
> User.find(1).then(user => {
  console.log(`${user.name} is working as expected.`);
});
// => Promise
// 'Stephen Curry is working as expected.'
> PostsController.beforeAction
// => [[Function], [Function], [Function]]
> routes
// => Router {...routes}
```

###### Intelligent Responses

Lux now intelligently observes the return value (or resolved `Promise` value for async functions) of your applications middleware and controller actions to serialize and respond with the correct data and status codes. Throwing an error at any point in time will cause a `500` and will be caught and handled gracefully (stack traces included when running outside of production).

These are a few example edge cases where returning a Model or an Array of Models may not be what you want to do.

```javascript
import { Controller } from 'lux-framework';

class ApplicationController extends Controller {
  beforeAction = [
    /**
     * If any request is sent to this application with `?bad=true` the server
     * will respond with 400 (Bad Request) and the latter actions will not be
     * called. Otherwise, the request will be handled normally.
     */
    function isGood(req) {
      if (req.params.bad) {
        return 400;
      }
    }
  ];

  /**
   * This will return 204 (No Content) and is equivalent to `return 204`.
   */
  health() {
    return true;
  }

  /**
   * This will return 401 (Unauthorized) and is equivalent to `return 204`.
   */
  topSecret() {
    return false;
  }

  /**
   * This will return 200 (OK) with the string 'bar'.
   */
  foo() {
    return 'bar';
  }

  /**
   * This will return 200 (OK) with the following JSON.
   *
   * {
   *   "foo": "bar"
   * }
   */
  fooJSON() {
    return {
      foo: 'bar'
    };
  }

  /**
   * This will return 404 (Not Found). Returning undefined will also result in
   * a 404 unless the function returning undefined is called from beforeAction.
   */
  notFound() {
    return null;
  }
}

export default ApplicationController;
```


###### Windows Support

Lux now is 100% compatible with Windows!

**NOTE:**
Travis-CI does not enable us to run our test suite on Windows. This shouldn't be an issue for development but it is highly recommend that you run Lux in a Docker container if your a deploying to Windows in production.

##### Notable Changes

* `lux serve` does not start in cluster mode by default. To run your application as a cluster run `lux serve -c` or `lux serve --cluster`.

* Commands that require an application build (`serve`, `db:*`, etc) now prefer strict mode and require you to specify `--use-weak` if you do not want to run in strict mode (you should pretty much always use strict mode).

##### Upgrading

The Lux CLI in 1.0 is not backwards compatible with previous beta versions so please perform a local upgrade before upgrading Lux globally.

###### Routes

Route definitions now must call `this.route` and `this.resource` rather than having `route` and `resource` as arguments to the function in `./app/routes.js`. This is the initial ground work for implementing [router namespaces](https://github.com/postlight/lux/blob/master/ROADMAP.md#router-namespaces).

```javascript
// ./app/routes.js

export default function routes() {
  this.resource('post');
  this.resource('users');

  this.route('users/login', {
    action: 'login',
    method: 'POST'
  });

  this.route('users/logout', {
    action: 'logout',
    method: 'DELETE'
  });
}
```

##### Commits

* [[`81f52fc1c8`](https://github.com/postlight/lux/commit/81f52fc1c8)] - **feat**: add luxify function for converting traditional middleware (#183) (Zachary Golba)
* [[`39ce152574`](https://github.com/postlight/lux/commit/39ce152574)] - **fix**: index names sometimes exceed max length in generated migrations (#182) (Zachary Golba)
* [[`fb5a71a897`](https://github.com/postlight/lux/commit/fb5a71a897)] - **feat**: add custom repl for debugging (#180) (Zachary Golba)
* [[`c2b0b30d01`](https://github.com/postlight/lux/commit/c2b0b30d01)] - **feat**: do not cluster by default use -c || --cluster (#179) (Zachary Golba)
* [[`785ebf1c39`](https://github.com/postlight/lux/commit/785ebf1c39)] - **fix**: regression from #177 local lux not being used in cli (#178) (Zachary Golba)
* [[`67b9940e5c`](https://github.com/postlight/lux/commit/67b9940e5c)] - **feat**: add windows support (#177) (Zachary Golba)
* [[`c4ab5e0b3b`](https://github.com/postlight/lux/commit/c4ab5e0b3b)] - **deps**: update rollup to version 0.33.0 (#176) (Greenkeeper)
* [[`a7e860dd97`](https://github.com/postlight/lux/commit/a7e860dd97)] - **deps**: update rollup-plugin-babel to version 2.6.1 (#172) (Greenkeeper)
* [[`68e7d8fafe`](https://github.com/postlight/lux/commit/68e7d8fafe)] - **deps**: update rollup-plugin-json to version 2.0.1 (#173) (Greenkeeper)
* [[`7abf664c99`](https://github.com/postlight/lux/commit/7abf664c99)] - **deps**: update rollup-plugin-eslint to version 2.0.2 (#175) (Greenkeeper)
* [[`f4e17aabf9`](https://github.com/postlight/lux/commit/f4e17aabf9)] - **deps**: update rollup-plugin-node-resolve to version 1.7.1 (#174) (Greenkeeper)
* [[`c2a77c68d5`](https://github.com/postlight/lux/commit/c2a77c68d5)] - **deps**: update rollup to version 0.32.4 (#171) (Greenkeeper)
* [[`b23873109b`](https://github.com/postlight/lux/commit/b23873109b)] - **deps**: update rollup-plugin-babel to version 2.6.0 (#169) (Greenkeeper)
* [[`7ed59ab595`](https://github.com/postlight/lux/commit/7ed59ab595)] - **deps**: update rollup to version 0.32.2 (#168) (Greenkeeper)
* [[`b25237a647`](https://github.com/postlight/lux/commit/b25237a647)] - **refactor**: use process.cwd() instead of process.env.PWD (#167) (Zachary Golba)
* [[`5bab51a38b`](https://github.com/postlight/lux/commit/5bab51a38b)] - **deps**: update babel-eslint to version 6.1.0 (#165) (Greenkeeper)
* [[`53cb1e53e2`](https://github.com/postlight/lux/commit/53cb1e53e2)] - **deps**: update rollup to version 0.32.1 (#164) (Greenkeeper)
* [[`022b2e954c`](https://github.com/postlight/lux/commit/022b2e954c)] - **deps**: upgrade pg version in test-app (#166) (Zachary Golba)
* [[`ef3f9ce8d3`](https://github.com/postlight/lux/commit/ef3f9ce8d3)] - **fix**: ensure lux is not an external dependency (#163) (Zachary Golba)
* [[`fba8654d2e`](https://github.com/postlight/lux/commit/fba8654d2e)] - **deps**: update test-app dependencies (#162) (Zachary Golba)
* [[`84160c9149`](https://github.com/postlight/lux/commit/84160c9149)] - **deps**: update babel-core to version 6.10.4 (#161) (Greenkeeper)
* [[`7ee935afa1`](https://github.com/postlight/lux/commit/7ee935afa1)] - **deps**: update babel-eslint to version 6.0.5 (#160) (Greenkeeper)
* [[`cd53552aca`](https://github.com/postlight/lux/commit/cd53552aca)] - **deps**: update eslint to version 2.13.1 (#159) (Greenkeeper)
* [[`8e6a23dad3`](https://github.com/postlight/lux/commit/8e6a23dad3)] - **refactor**: improve build process and stack traces (#158) (Zachary Golba)
* [[`6748638ca6`](https://github.com/postlight/lux/commit/6748638ca6)] - **refactor**: rename serializer methods and return objects (#155) (Zachary Golba)
* [[`7597031076`](https://github.com/postlight/lux/commit/7597031076)] - **feat**: ensure Application#port is a number (#156) (Zachary Golba)
* [[`2d83f30df6`](https://github.com/postlight/lux/commit/2d83f30df6)] - **deps**: update rollup to version 0.32.0 (#154) (Greenkeeper)
* [[`64250ebe5b`](https://github.com/postlight/lux/commit/64250ebe5b)] - **refactor**: separate responsibilities in req/res flow (#153) (Zachary Golba)

### 0.0.1-beta.13 (June 18, 2016)

* [[`30a60c10ca`](https://github.com/postlight/lux/commit/30a60c10ca)] - **chore**: bump version to 0.0.1-beta.13 (Zachary Golba)
* [[`a569225072`](https://github.com/postlight/lux/commit/a569225072)] - **feat**: match ember-data jsonapi pagination implementation (#151) (Zachary Golba)
* [[`ea4786b791`](https://github.com/postlight/lux/commit/ea4786b791)] - **deps**: update mysql2 to version 1.0.0-rc.5 in test-app (#150) (Zachary Golba)
* [[`9b78c19540`](https://github.com/postlight/lux/commit/9b78c19540)] - **style**: change tabs to spaces in .eslintrc.js (#149) (Zachary Golba)
* [[`853d81a5d5`](https://github.com/postlight/lux/commit/853d81a5d5)] - **deps**: update bluebird to version 3.4.1 (#147) (Greenkeeper)
* [[`873f92dcac`](https://github.com/postlight/lux/commit/873f92dcac)] - **deps**: update eslint to version 2.13.0 (#146) (Greenkeeper)

### 0.0.1-beta.12 (June 13, 2016)

* [[`723c403598`](https://github.com/postlight/lux/commit/723c403598)] - **feat**: generate basic .eslintrc.json with `lux new` cmd (Zachary Golba)
* [[`952fa65db3`](https://github.com/postlight/lux/commit/952fa65db3)] - **deps**: update rollup to version 0.31.2 (#141) (Greenkeeper)
* [[`07bdc43db1`](https://github.com/postlight/lux/commit/07bdc43db1)] - **docs**: update CHANGELOG.md (Zachary Golba)

### 0.0.1-beta.11 (June 12, 2016)

This is the last big set of breaking changes before a stable `1.0.0` release
and moving forward we will strictly follow semantic versioning.

If all goes well in this release the next release will be `1.0.0-rc` and will
only contain a few more features geared towards application profiling.

##### Commits

* [[`30f962c003`](https://github.com/postlight/lux/commit/30f962c003)] - **deps**: update dependencies (Zachary Golba)
* [[`b6700be793`](https://github.com/postlight/lux/commit/b6700be793)] - **refactor**: move query proxy to initializer function (Zachary Golba)
* [[`b53c58a06f`](https://github.com/postlight/lux/commit/b53c58a06f)] - **chore**: update examples (Zachary Golba)
* [[`2d0f2ef941`](https://github.com/postlight/lux/commit/2d0f2ef941)] - **feat**: support n:m relationships (Zachary Golba)
* [[`93e3c0a14b`](https://github.com/postlight/lux/commit/93e3c0a14b)] - **feat**: add chainable query interface (Zachary Golba)
* [[`425b8de4cc`](https://github.com/postlight/lux/commit/425b8de4cc)] - **feat**: use watchman for file watcher with fs.watch fallback (Zachary Golba)
* [[`97bed29798`](https://github.com/postlight/lux/commit/97bed29798)] - **refactor**: remove all decorators from private and public APIs (Zachary Golba)
* [[`53e257ae66`](https://github.com/postlight/lux/commit/53e257ae66)] - **refactor**: use lux babel preset (Zachary Golba)
* [[`2512e857b2`](https://github.com/postlight/lux/commit/2512e857b2)] - **refactor**: use streams for Logger (Zachary Golba)
* [[`4341f5cebd`](https://github.com/postlight/lux/commit/4341f5cebd)] - **refactor**: use rollup for build (Zachary Golba)
* [[`6bc225ac87`](https://github.com/postlight/lux/commit/6bc225ac87)] - **feat**: add file watcher (Zachary Golba)
* [[`5425c512e8`](https://github.com/postlight/lux/commit/5425c512e8)] - **feat**: add process manager (Zachary Golba)
* [[`7d0463a3f0`](https://github.com/postlight/lux/commit/7d0463a3f0)] - **feat**: tree-shaking, native es6, and start of HMR work (Zachary Golba)
* [[`82eab320d2`](https://github.com/postlight/lux/commit/82eab320d2)] - **docs**: start api documentation (Zachary Golba)
* [[`7e4a38c781`](https://github.com/postlight/lux/commit/7e4a38c781)] - **deps**: update eslint to version 2.12.0 (#140) (Greenkeeper)
* [[`6b8b29aea3`](https://github.com/postlight/lux/commit/6b8b29aea3)] - **deps**: update eslint to version 2.11.1 (#139) (Greenkeeper)
* [[`ef8b36cb2f`](https://github.com/postlight/lux/commit/ef8b36cb2f)] - **deps**: update babel-core to version 6.9.1 (#137) (Greenkeeper)
* [[`c5c812dc62`](https://github.com/postlight/lux/commit/c5c812dc62)] - **deps**: update eslint to version 2.11.0 (#135) (Greenkeeper)
* [[`24033dcfb3`](https://github.com/postlight/lux/commit/24033dcfb3)] - **chore**: update eslint config (#133) (Zachary Golba)
* [[`ed58e7a685`](https://github.com/postlight/lux/commit/ed58e7a685)] - **deps**: update mocha to version 2.5.3 (#132) (Greenkeeper)
* [[`c76c51b802`](https://github.com/postlight/lux/commit/c76c51b802)] - **deps**: update mocha to version 2.5.2 (#130) (Greenkeeper)

##### Upgrading

###### Application

For the sake of proper namespacing, Lux no longer exports the `Application`
class as a `default` export. To upgrade simply use a named import of
`Application` within your `./app/index.js` file.

```javascript
import { Application } from 'lux-framework';

class MyApp extends Application {

}

export default MyApp;
```

You could also use a namespaced import of Lux if you are worried about
collisions.

```javascript
import Lux from 'lux-framework';

class MyApp extends Lux.Application {

}

export default MyApp;
```

###### Models

Models now support scopes and have a chainable query interface. More docs will
soon be available on this but for now it should be as simple as replacing calls
to `Model.findAll` with `Model.where`.

###### Controllers

Decorators are no longer used to declare custom actions on your controller. For
an easy upgrade simply remove the `@action` at the top of your custom actions.

```javascript
import { Controller } from 'lux-framework';

import Post from '../models/post';

class PostsController extends Controller {
  drafts() {
    return Post.drafts();
  }
}

export default PostsController;
```

###### Routes

Route declarations no longer support an arrow function export since arrow
functions do not have a `name` property.

```javascript
// ./app/routes.js

export default function routes(route, resource) {
  resource('posts');
}
```

###### Seed

The db seed function no longer support an arrow function export since arrow
functions do not have a `name` property.

```javascript
// ./db/seed.js

export default function seed() {
  resource('posts');
}
```

###### Config

Config files found in `./config/environments` now only require a single option
`log`.

```javascript
// ./config/environments/development.js

export default {
  log: true
};
```

###### .babelrc

Lux now uses a special babel [preset](https://github.com/zacharygolba/babel-preset-lux)
to only transpile features that are missing from Node 6.X. That means that ~95%
of ES2015 syntax is actually using a native implementation. You can expect a
performance boost in this release 🐇.

```json
{
  "presets": ["lux"]
}
```

###### package.json

Update your `package.json` to only include the following base packages required
for a Lux application (plus the ones you installed yourself).

```json
{
  "babel-core": "6.9.1",
  "babel-preset-lux": "1.0.0",
  "knex": "0.11.5",
  "lux-framework": "0.0.1-beta.11",
  "sqlite3": "3.1.4"
}
```

### 0.0.1-beta.10 (May 23, 2016)

* [[`f2b63501c9`](https://github.com/postlight/lux/commit/f2b63501c9)] - **chore**: bump version to 0.0.1-beta.10 (Zachary Golba)
* [[`00a139653b`](https://github.com/postlight/lux/commit/00a139653b)] - **refactor**: use webpack for build (#121) (Zachary Golba)
* [[`47cfa90f02`](https://github.com/postlight/lux/commit/47cfa90f02)] - **deps**: update mocha to version 2.5.1 (#128) (Greenkeeper)
* [[`bbf73047eb`](https://github.com/postlight/lux/commit/bbf73047eb)] - **docs**: remove node-orm2 references from ROADMAP.md (#126) (Zachary Golba)
* [[`4338d05c3b`](https://github.com/postlight/lux/commit/4338d05c3b)] - **docs**: fix broken links in CHANGELOG.md (#125) (Zachary Golba)
* [[`50c18275a0`](https://github.com/postlight/lux/commit/50c18275a0)] - **docs**: update code sample in README.md (#124) (Zachary Golba)
* [[`940b53a7ed`](https://github.com/postlight/lux/commit/940b53a7ed)] - **chore**: add CHANGELOG.md (#123) (Zachary Golba)
* [[`8837cb5064`](https://github.com/postlight/lux/commit/8837cb5064)] - **fix**: NODE_ENV is not being passed down to child processes (#122) (Zachary Golba)
* [[`c9f2aef952`](https://github.com/postlight/lux/commit/c9f2aef952)] - **feat**: confirm overwriting files with lux generate cmd (#120) (Zachary Golba)
* [[`06dffaf0cd`](https://github.com/postlight/lux/commit/06dffaf0cd)] - **chore**: .editorconfig file (#119) (Joan Piedra)
* [[`a7f191003d`](https://github.com/postlight/lux/commit/a7f191003d)] - **feat**: improve error handling on missing controller & serializer files (#118) (Joan Piedra)
* [[`1dd3ab64c4`](https://github.com/postlight/lux/commit/1dd3ab64c4)] - **refactor**: remove Base package (#117) (Zachary Golba)
* [[`0f64cc864a`](https://github.com/postlight/lux/commit/0f64cc864a)] - **fix**: hasMany relationships are not eager loading properly (#116) (Zachary Golba)
* [[`11cb766267`](https://github.com/postlight/lux/commit/11cb766267)] - **fix**: select statement not being optimized by fields param (#115) (Zachary Golba)
* [[`ad3564fc8b`](https://github.com/postlight/lux/commit/ad3564fc8b)] - **fix**: pagination links break with an empty table (#114) (Zachary Golba)
* [[`1b84009543`](https://github.com/postlight/lux/commit/1b84009543)] - **fix**: ignore hidden and non .js files in loader (#113) (Joan Piedra)
* [[`6d97ca7545`](https://github.com/postlight/lux/commit/6d97ca7545)] - **fix**: using ?include is not working with multiple resources (#112) (Zachary Golba)
* [[`ef8e779867`](https://github.com/postlight/lux/commit/ef8e779867)] - **fix**: defaultValue is not accounted for in #108 (#111) (Zachary Golba)
* [[`71a1be6ccc`](https://github.com/postlight/lux/commit/71a1be6ccc)] - **fix**: column data not consistent across all dbms (#108) (Zachary Golba)
* [[`7c897ae0f2`](https://github.com/postlight/lux/commit/7c897ae0f2)] - **fix**: multiple 'hasMany' 'type' values are incorrect in serialized data (#109) (Zachary Golba)
* [[`a03cde5195`](https://github.com/postlight/lux/commit/a03cde5195)] - **chore**: update example apps (#105) (Zachary Golba)
* [[`824caab17f`](https://github.com/postlight/lux/commit/824caab17f)] - **deps**: update ora to version 0.2.3 (#101) (Greenkeeper)

### 0.0.1-beta.9 (May 18, 2016)

* [[`4002a5a64d`](https://github.com/postlight/lux/commit/4002a5a64d)] - **chore**: bump version to 0.0.1-beta.9 (#97) (Zachary Golba)
* [[`a7e54aa4da`](https://github.com/postlight/lux/commit/a7e54aa4da)] - **fix**: middleware functions added in 'beforeAction' not executing (#95) (Zachary Golba)
* [[`b16557647e`](https://github.com/postlight/lux/commit/b16557647e)] - **fix**: migration generator does not change - to _ (#96) (Zachary Golba)
* [[`81cdd2108b`](https://github.com/postlight/lux/commit/81cdd2108b)] - **fix**: remove short -db flag from lux new cmd (#93) (Zachary Golba)
* [[`71f4593fbb`](https://github.com/postlight/lux/commit/71f4593fbb)] - **refactor**: use chalk instead of colors (#92) (Zachary Golba)
* [[`786872becb`](https://github.com/postlight/lux/commit/786872becb)] - **fix**: config generator uses double quotes (#89) (Zachary Golba)
* [[`2fb314ad1b`](https://github.com/postlight/lux/commit/2fb314ad1b)] - **deps**: update bluebird to version 3.4.0 (#91) (Zachary Golba)
* [[`d95fb392c2`](https://github.com/postlight/lux/commit/d95fb392c2)] - **deps**: update babel-preset-es2015 to version 6.9.0 (#90) (Zachary Golba)
* [[`6c7b42ddad`](https://github.com/postlight/lux/commit/6c7b42ddad)] - **deps**: update babel-runtime to version 6.9.0 (#88) (Greenkeeper)
* [[`095d12a100`](https://github.com/postlight/lux/commit/095d12a100)] - **deps**: update babel-plugin-transform-runtime to version 6.9.0 (#87) (Greenkeeper)
* [[`9ef804ecd9`](https://github.com/postlight/lux/commit/9ef804ecd9)] - **deps**: update babel-core to version 6.9.0 (#86) (Greenkeeper)
* [[`23251651e9`](https://github.com/postlight/lux/commit/23251651e9)] - **chore**: add keywords to package.json (#81) (Zachary Golba)
* [[`418cadb662`](https://github.com/postlight/lux/commit/418cadb662)] - **chore**: add dependencies badge to README.md (#80) (Zachary Golba)
* [[`af3e72b73e`](https://github.com/postlight/lux/commit/af3e72b73e)] - **deps**: Update all dependencies 🌴 (#79) (Greenkeeper)
* [[`2560584a4f`](https://github.com/postlight/lux/commit/2560584a4f)] - **chore**: update roadmap to reflect changes in #65 (#78) (Zachary Golba)

### 0.0.1-beta.8 (May 14, 2016)

* [[`6416c6c309`](https://github.com/postlight/lux/commit/6416c6c309)] - **feat**: implement custom orm on top of knex.js (#65) (Zachary Golba)
* [[`d117376a46`](https://github.com/postlight/lux/commit/d117376a46)] - **test**: add sudo and correct g++ version for node 4+ in .travis.yml (#70) (Zachary Golba)
* [[`9a293bd117`](https://github.com/postlight/lux/commit/9a293bd117)] - **feat**: use js instead of json for config files (#67) (John-Henry Liberty)
* [[`720f0e1323`](https://github.com/postlight/lux/commit/720f0e1323)] - **test**: update travis to use npm link (#68) (John-Henry Liberty)
* [[`2fc214c045`](https://github.com/postlight/lux/commit/2fc214c045)] - **feat**: use local lux install if one exists (#66) (Zachary Golba)

### 0.0.1-beta.7 (May 01, 2016)

* [[`e35c430cdc`](https://github.com/postlight/lux/commit/e35c430cdc)] - **chore**: bump version to 0.0.1-beta.7 (#64) (Zachary Golba)
* [[`ec0b60b191`](https://github.com/postlight/lux/commit/ec0b60b191)] - **fix**: HEAD and OPTIONS request result in a 404 (#63) (Zachary Golba)

### 0.0.1-beta.6 (April 28, 2016)

* [[`4079b07269`](https://github.com/postlight/lux/commit/4079b07269)] - **chore**: bump version to 0.0.1-beta.6 (#61) (Zachary Golba)
* [[`b94c526e87`](https://github.com/postlight/lux/commit/b94c526e87)] - **fix**: serialize hasMany relationships (#60) (Zachary Golba)
* [[`2f5aa41c1a`](https://github.com/postlight/lux/commit/2f5aa41c1a)] - **chore**: test on node 6 (#58) (Zachary Golba)
* [[`e26a900e43`](https://github.com/postlight/lux/commit/e26a900e43)] - **docs**: add ROADMAP.md (#57) (Zachary Golba)

### 0.0.1-beta.5 (April 22, 2016)

* [[`8a21b472e0`](https://github.com/postlight/lux/commit/8a21b472e0)] - **chore**: bump version to 0.0.1-beta.5 (#55) (Zachary Golba)
* [[`909e732b9a`](https://github.com/postlight/lux/commit/909e732b9a)] - **chore**: update dependencies (#54) (Zachary Golba)
* [[`47ef4b87a8`](https://github.com/postlight/lux/commit/47ef4b87a8)] - **fix**: miss-match session key/secret error (#53) (Zachary Golba)
* [[`e70a032c0f`](https://github.com/postlight/lux/commit/e70a032c0f)] - **fix**: strings w/ commas interpreted as an array for POST/PATCH (#49) (Zachary Golba)
* [[`23da23d74d`](https://github.com/postlight/lux/commit/23da23d74d)] - **docs**: add npm package badge to README (#47) (Zachary Golba)
* [[`0788e468a6`](https://github.com/postlight/lux/commit/0788e468a6)] - **test**: add unit/integration tests (#39) (Zachary Golba)
* [[`498c951917`](https://github.com/postlight/lux/commit/498c951917)] - **chore**: add Gitter badge (#46) (The Gitter Badger)

### 0.0.1-beta.4 (April 21, 2016)

* [[`77dcdbe03b`](https://github.com/postlight/lux/commit/77dcdbe03b)] - **chore**: bump version to 0.0.1-beta.4 (#45) (Zachary Golba)
* [[`7c529fa235`](https://github.com/postlight/lux/commit/7c529fa235)] - **fix**: correct typo in README (#44) (Nic Young)
* [[`0880a71d89`](https://github.com/postlight/lux/commit/0880a71d89)] - **fix**: globally disable orm2 cache (Zachary Golba)
* [[`0bd7c8dfde`](https://github.com/postlight/lux/commit/0bd7c8dfde)] - **fix**: make ora a runtime dependency (#40) (Zachary Golba)
* [[`30ca0c27d5`](https://github.com/postlight/lux/commit/30ca0c27d5)] - **feat**: add spinner for long running task (#38) (Albert Yu)

### 0.0.1-beta.3 (April 18, 2016)

* [[`03958b98d1`](https://github.com/postlight/lux/commit/03958b98d1)] - **chore**: bump version to 0.0.1-beta.3 (#37) (Zachary Golba)
* [[`10b782be1f`](https://github.com/postlight/lux/commit/10b782be1f)] - **fix**: logger date incorrect (#35) (kev5873)
* [[`e9897371be`](https://github.com/postlight/lux/commit/e9897371be)] - **chore**: Link to Medium Article in Readme (#33) (Zachary Golba)

### 0.0.1-beta.2 (April 18, 2016)

* [[`c073253cd0`](https://github.com/postlight/lux/commit/c073253cd0)] - **fix**: listening message dispatched before workers are ready (#34) (Zachary Golba)

### 0.0.1-beta.1 (April 17, 2016)

* [[`5a734e79ce`](https://github.com/postlight/lux/commit/5a734e79ce)] - **fix**: shebang line not finding node on linux (#32) (Zachary Golba)

### 0.0.1-beta (April 07, 2016)

* [[`4a193b86d2`](https://github.com/postlight/lux/commit/4a193b86d2)] - Initial Commit (Zachary Golba)
