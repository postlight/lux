# Lux Changelog

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

##### Models

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

##### Models

Models now support scopes and have a chainable query interface. More docs will
soon be available on this but for now it should be as simple as replacing calls
to `Model.findAll` with `Model.where`.

##### Controllers

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

##### Routes

Route declarations no longer support an arrow function export since arrow
functions do not have a `name` property.

```javascript
// ./app/routes.js

export default function routes(route, resource) {
  resource('posts');
}
```

##### Seed

The db seed function no longer support an arrow function export since arrow
functions do not have a `name` property.

```javascript
// ./db/seed.js

export default function seed() {
  resource('posts');
}
```

##### Config

Config files found in `./config/environments` now only require a single option
`log`.

```javascript
// ./config/environments/development.js

export default {
  log: true
};
```

##### .babelrc

Lux now uses a special babel [preset](https://github.com/zacharygolba/babel-preset-lux)
to only transpile features that are missing from Node 6.X. That means that ~95%
of ES2015 syntax is actually using a native implementation. You can expect a
performance boost in this release 🐇.

```json
{
  "presets": ["lux"]
}
```

##### package.json

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
