# Lux Changelog

### v1.1.3 (Jan 17, 2017)

##### Upgrading

Due to a change in the way the cli modules are bundled, you may need to uninstall
and reinstall lux globally before upgrading your application.

```bash
npm uninstall -g lux-framework
npm cache clean
npm install -g lux-framework@latest
```

##### Commits

*   [[`89dff6162c`](https://github.com/postlight/lux/commit/89dff6162c)] - **fix**: we should check for lux under the dependency key in package.json not root (#643) (Zachary Golba)
*   [[`b7c66cb41f`](https://github.com/postlight/lux/commit/b7c66cb41f)] - **fix**: make sure dates are correctly validated & parsed (#639) (Nick Schot)
*   [[`00273c8279`](https://github.com/postlight/lux/commit/00273c8279)] - **deps**: update ora to version 1.0.0 (#641) (Greenkeeper)
*   [[`fe2b860abd`](https://github.com/postlight/lux/commit/fe2b860abd)] - **deps**: update source-map-support to version 0.4.10 (#642) (Greenkeeper)
*   [[`f41fc048b9`](https://github.com/postlight/lux/commit/f41fc048b9)] - **deps**: integrate rollup-plugin-lux (#632) (Zachary Golba)
*   [[`e4ed011b0a`](https://github.com/postlight/lux/commit/e4ed011b0a)] - **deps**: update eslint-plugin-flowtype to version 2.30.0 (#636) (Greenkeeper)
*   [[`df95938f3f`](https://github.com/postlight/lux/commit/df95938f3f)] - **deps**: update source-map-support to version 0.4.9 (#634) (Greenkeeper)
*   [[`ebbcf577bd`](https://github.com/postlight/lux/commit/ebbcf577bd)] - **fix**: migration generator indexes (#625) (Nick Schot)
*   [[`93aa5c47bd`](https://github.com/postlight/lux/commit/93aa5c47bd)] - **fix**: make pages consistent when using sort on non-unique attributes  (#633) (Nick Schot)
*   [[`d1589ab8f3`](https://github.com/postlight/lux/commit/d1589ab8f3)] - **test**: allow appveyor builds to fail with pg driver (#635) (Zachary Golba)
*   [[`682d6fef56`](https://github.com/postlight/lux/commit/682d6fef56)] - **chore**: improve ci config and process (#627) (Zachary Golba)
*   [[`d0795c36fa`](https://github.com/postlight/lux/commit/d0795c36fa)] - **deps**: update rollup to version 0.41.4 (#630) (Greenkeeper)
*   [[`20d6f0dbe7`](https://github.com/postlight/lux/commit/20d6f0dbe7)] - **deps**: update ansi-regex to version 2.1.1 (#629) (Greenkeeper)
*   [[`016938c401`](https://github.com/postlight/lux/commit/016938c401)] - **deps**: update rollup to version 0.41.3 (#628) (Greenkeeper)
*   [[`e7d069ffe7`](https://github.com/postlight/lux/commit/e7d069ffe7)] - **deps**: update rollup to version 0.41.1 (#616) (Greenkeeper)
*   [[`1626cd882c`](https://github.com/postlight/lux/commit/1626cd882c)] - **deps**: update ora to version 0.4.1 (#623) (Greenkeeper)
*   [[`60b33a6a33`](https://github.com/postlight/lux/commit/60b33a6a33)] - **deps**: update eslint to version 3.13.1 (#622) (Greenkeeper)
*   [[`b050cfaf03`](https://github.com/postlight/lux/commit/b050cfaf03)] - **deps**: update eslint-config-airbnb-base to version 11.0.1 (#619) (Greenkeeper)
*   [[`5a879d467e`](https://github.com/postlight/lux/commit/5a879d467e)] - **deps**: update eslint to version 3.13.0 (#615) (Greenkeeper)
*   [[`fbbf198e2b`](https://github.com/postlight/lux/commit/fbbf198e2b)] - **deps**: update babel-plugin-istanbul to version 3.1.2 (#611) (Greenkeeper)
*   [[`4c5e326afa`](https://github.com/postlight/lux/commit/4c5e326afa)] - **release**: v1.1.2 🔧 (#609) (Zachary Golba)

### v1.1.2 (Jan 3, 2017)

:tada: Happy New Year!

##### Commits

*   [[`f828e8effa`](https://github.com/postlight/lux/commit/f828e8effa)] - **fix**: database is undefined when using the postgresql driver (#605) (Zachary Golba)
*   [[`46ed68b35a`](https://github.com/postlight/lux/commit/46ed68b35a)] - **deps**: update third party type definitions (#604) (Zachary Golba)
*   [[`914a4b831d`](https://github.com/postlight/lux/commit/914a4b831d)] - **deps**: update sinon to version 1.17.7 (#602) (Greenkeeper)
*   [[`d3ffda9156`](https://github.com/postlight/lux/commit/d3ffda9156)] - **deps**: update eslint-plugin-flowtype to version 2.29.2 (#595) (Greenkeeper)
*   [[`f5b002e3dd`](https://github.com/postlight/lux/commit/f5b002e3dd)] - **release**: v1.1.1 🔧 (#594) (Zachary Golba)

### v1.1.1 (Dec 28, 2016)

##### Commits

*   [[`c54cc20844`](https://github.com/postlight/lux/commit/c54cc20844)] - **fix**: options request does not work with query params (#573) (Zachary Golba)
*   [[`93df71f3c9`](https://github.com/postlight/lux/commit/93df71f3c9)] - **deps**: update babel-plugin-istanbul to version 3.0.0 (#591) (Greenkeeper)
*   [[`0f724109fa`](https://github.com/postlight/lux/commit/0f724109fa)] - **deps**: update source-map-support to version 0.4.8 🚀 (#590) (Greenkeeper)
*   [[`fdb7a9e7fc`](https://github.com/postlight/lux/commit/fdb7a9e7fc)] - **deps**: update flow-bin to version 0.37.4 🚀 (#587) (Greenkeeper)
*   [[`302a10fd61`](https://github.com/postlight/lux/commit/302a10fd61)] - **docs**: remove irrelevant doc comments from query class (#578) (Zachary Golba)
*   [[`ccb645c0f0`](https://github.com/postlight/lux/commit/ccb645c0f0)] - **refactor**: lint binary and scripts (#576) (Zachary Golba)
*   [[`20c381fd75`](https://github.com/postlight/lux/commit/20c381fd75)] - **deps**: update test-app dependencies (#577) (Zachary Golba)
*   [[`4fad8cbdf5`](https://github.com/postlight/lux/commit/4fad8cbdf5)] - **deps**: update babel-preset-lux to version 2.0.1 (#570) (Zachary Golba)
*   [[`ac08ca4fea`](https://github.com/postlight/lux/commit/ac08ca4fea)] - **deps**: update ora to version 0.4.0 (#575) (Greenkeeper)
*   [[`557e2c2805`](https://github.com/postlight/lux/commit/557e2c2805)] - **deps**: update babel-core to version 6.21.0 (#567) (Greenkeeper)
*   [[`c94b2597df`](https://github.com/postlight/lux/commit/c94b2597df)] - **deps**: update remark-lint to version 5.4.0 (#572) (Greenkeeper)
*   [[`8ab08b3bba`](https://github.com/postlight/lux/commit/8ab08b3bba)] - **deps**: update eslint to version 3.12.1 (#564) (Greenkeeper)
*   [[`a139b81b8e`](https://github.com/postlight/lux/commit/a139b81b8e)] - **deps**: update eslint-config-airbnb-base to version 11.0.0 🚀 (#560) (Greenkeeper)
*   [[`821a2c49af`](https://github.com/postlight/lux/commit/821a2c49af)] - **deps**: update rollup to version 0.37.0 (#561) (Greenkeeper)
*   [[`7eab2633d0`](https://github.com/postlight/lux/commit/7eab2633d0)] - **deps**: update flow-bin to version 0.37.0 🚀 (#563) (Greenkeeper)
*   [[`ae4c4df189`](https://github.com/postlight/lux/commit/ae4c4df189)] - **deps**: update rollup-plugin-babel to version 2.7.1 (#565) (Greenkeeper)
*   [[`f94ac5234c`](https://github.com/postlight/lux/commit/f94ac5234c)] - **docs**: add more api docs and improve existing content (#559) (Zachary Golba)

### 1.1.0 (Dec 10, 2016)

##### Features

###### Transactions

This release introduces a public transaction api to the model class. Changes are
backwards compatible with the previous model api.

Internally, all methods that modify the state of the database are wrapped in
transactions. If the transaction fails, all calls to `create`, `save`, or
`update` will be rolled back to the state before the transaction began.

**Example:**

```javascript
import User from 'app/models/user';

// This internally uses a transaction.
await User.create({
  firstName: 'New',
  lastName: 'User'
});
```

### Working With Transactions

You have the ability to manually specify the transaction that will be used for a
`create`, `update`, or `save` call with the static and instance method, `transacting`.

**Example:**

```javascript
import { Model } from 'lux-framework';

import Profile from 'app/models/profile';

class User extends Model {
  static hasOne = {
    profile: {
      inverse: 'user'
    }
  };

  static hooks = {
    async beforeCreate(user, trx) {
      // If the transaction fails the profile instance will not be persisted.
      user.profile = await Profile
        .transacting(trx)
        .create();
    }
  };
}
```

You can also manually trigger create a transaction if you plan on creating many
model instances as once.

**Example:**

```javascript
import User from 'app/models/user';

User.transaction(trx => (
  Promise.all([
    User
      .transacting(trx)
      .create({
        firstName: 'New',
        lastName: 'User'
      }),
    User
      .transacting(trx)
      .create({
        firstName: 'New',
        lastName: 'User'
      }),
    User
      .transacting(trx)
      .create({
        firstName: 'New',
        lastName: 'User'
      })
  ])
));
```

##### Commits

*   [[`3f15362600`](https://github.com/postlight/lux/commit/3f15362600)] - **deps**: update babel-core to version 6.20.0 (#556) (Greenkeeper)
*   [[`9a20c5ce11`](https://github.com/postlight/lux/commit/9a20c5ce11)] - **deps**: update eslint to version 3.12.0 (#557) (Greenkeeper)
*   [[`7f53cd230c`](https://github.com/postlight/lux/commit/7f53cd230c)] - **docs**: fix broken logo in readme (#555) (Zachary Golba)
*   [[`590956ed52`](https://github.com/postlight/lux/commit/590956ed52)] - **docs**: add preliminary guide files (#554) (Zachary Golba)
*   [[`16d224b4e7`](https://github.com/postlight/lux/commit/16d224b4e7)] - **feat**: use transactions when writing to the database (#527) (Zachary Golba)
*   [[`9e89b042cd`](https://github.com/postlight/lux/commit/9e89b042cd)] - **deps**: update eslint-plugin-flowtype to version 2.29.1 (#549) (Greenkeeper)
*   [[`5b3e91e5f9`](https://github.com/postlight/lux/commit/5b3e91e5f9)] - **deps**: update eslint to version 3.11.1 (#547) (Greenkeeper)
*   [[`4eb0c9b926`](https://github.com/postlight/lux/commit/4eb0c9b926)] - **deps**: update eslint-plugin-flowtype to version 2.28.2 (#546) (Greenkeeper)
*   [[`42f1707ac8`](https://github.com/postlight/lux/commit/42f1707ac8)] - **deps**: update eslint to version 3.11.0 🚀 (#539) (Greenkeeper)
*   [[`39adf76c3a`](https://github.com/postlight/lux/commit/39adf76c3a)] - **deps**: update rollup to version 0.36.4 (#536) (Greenkeeper)
*   [[`23189f535b`](https://github.com/postlight/lux/commit/23189f535b)] - **deps**: update flow-bin to version 0.36.0 🚀 (#537) (Greenkeeper)
*   [[`394d3132e7`](https://github.com/postlight/lux/commit/394d3132e7)] - **deps**: update nyc to version 10.0.0 (#535) (Greenkeeper)
*   [[`ef33526860`](https://github.com/postlight/lux/commit/ef33526860)] - **deps**: update mocha to version 3.2.0 (#538) (Greenkeeper)
*   [[`760ae5f68c`](https://github.com/postlight/lux/commit/760ae5f68c)] - **release**: 1.0.5 🔧 (#534) (Zachary Golba)

### 1.0.5 (Nov 20, 2016)

##### Commits

*   [[`45c18600c4`](https://github.com/postlight/lux/commit/45c18600c4)] - **deps**: update babel-eslint to version 7.1.1 (#533) (Greenkeeper)
*   [[`0720dda77f`](https://github.com/postlight/lux/commit/0720dda77f)] - **deps**: update eslint to version 3.10.2 (#532) (Greenkeeper)
*   [[`dbdcc5a2de`](https://github.com/postlight/lux/commit/dbdcc5a2de)] - **fix**: query parameters are not added to custom routes (#528) (Nick Schot)
*   [[`4530d0ce8d`](https://github.com/postlight/lux/commit/4530d0ce8d)] - **deps**: update nyc to version 9.0.1 (#530) (Greenkeeper)
*   [[`8d36091058`](https://github.com/postlight/lux/commit/8d36091058)] - **deps**: update eslint to version 3.10.1 (#529) (Greenkeeper)
*   [[`c586f350f6`](https://github.com/postlight/lux/commit/c586f350f6)] - **docs**: use master branch for appveyor badge (#526) (Zachary Golba)
*   [[`e93b45ca4b`](https://github.com/postlight/lux/commit/e93b45ca4b)] - **deps**: update test-app dependencies (#525) (Zachary Golba)
*   [[`0bbb7af65c`](https://github.com/postlight/lux/commit/0bbb7af65c)] - **release**: 1.0.4 🔧 (#524) (Zachary Golba)

### 1.0.4 (Nov 12, 2016)

##### Commits

*   [[`7d2ff0d316`](https://github.com/postlight/lux/commit/7d2ff0d316)] - **fix**: ids in json payloads should be cast to number (#523) (Zachary Golba)
*   [[`8cca55e756`](https://github.com/postlight/lux/commit/8cca55e756)] - **fix**: empty 1:1 relationships are not returned in correct format (#521) (Zachary Golba)
*   [[`6919517b37`](https://github.com/postlight/lux/commit/6919517b37)] - **test**: prevent ci builds from failing due to time constraints (#520) (Zachary Golba)
*   [[`090f871f18`](https://github.com/postlight/lux/commit/090f871f18)] - **fix**: passing value null in post to type number throws type error (#516) (Zachary Golba)
*   [[`6cd3e68b6e`](https://github.com/postlight/lux/commit/6cd3e68b6e)] - **deps**: update flow-bin to version 0.35.0 🚀 (#517) (Greenkeeper)
*   [[`cd4f63fe4a`](https://github.com/postlight/lux/commit/cd4f63fe4a)] - **deps**: update eslint to version 3.10.0 (#518) (Greenkeeper)
*   [[`b97d093c9a`](https://github.com/postlight/lux/commit/b97d093c9a)] - **fix**: default values override all falsy attribute values (#515) (Zachary Golba)
*   [[`6f4e17078c`](https://github.com/postlight/lux/commit/6f4e17078c)] - **dx**: use flow-typed instead of custom type declarations when possible (#514) (Zachary Golba)
*   [[`44b88250a2`](https://github.com/postlight/lux/commit/44b88250a2)] - **docs**: use shields.io for project status badges in readme (#513) (Zachary Golba)
*   [[`2e9c3353b1`](https://github.com/postlight/lux/commit/2e9c3353b1)] - **release**: 1.0.3 🔧 (#512) (Zachary Golba)

### 1.0.3 (Nov 10, 2016)

##### Commits

*   [[`53378f622b`](https://github.com/postlight/lux/commit/53378f622b)] - **fix**: dynamic segments are not parsed on model-less resources (#510) (Zachary Golba)
*   [[`56321bb7df`](https://github.com/postlight/lux/commit/56321bb7df)] - **fix**: small typos in model initialize-class.js (#505) (Nick Schot)
*   [[`7769865731`](https://github.com/postlight/lux/commit/7769865731)] - **chore**: use codecov bash uploader (#511) (Zachary Golba)
*   [[`edb4635b8c`](https://github.com/postlight/lux/commit/edb4635b8c)] - **fix**: some strings in request body cast to another type (#506) (Zachary Golba)
*   [[`dea08354ab`](https://github.com/postlight/lux/commit/dea08354ab)] - **deps**: update eslint-config-airbnb-base to version 10.0.1 🚀 (#503) (Greenkeeper)
*   [[`b7435570fc`](https://github.com/postlight/lux/commit/b7435570fc)] - **deps**: update eslint-plugin-import to version 2.2.0 (#504) (Greenkeeper)
*   [[`18ba638610`](https://github.com/postlight/lux/commit/18ba638610)] - **deps**: update babel-plugin-transform-es2015-modules-commonjs to version 6.18.0 (#500) (Zachary Golba)
*   [[`59a16f19ca`](https://github.com/postlight/lux/commit/59a16f19ca)] - **deps**: update eslint to version 3.9.1 (#501) (Zachary Golba)
*   [[`e12eb406d2`](https://github.com/postlight/lux/commit/e12eb406d2)] - **deps**: update eslint-plugin-import to version 2.1.0 (#498) (Greenkeeper)
*   [[`7b1c48b4aa`](https://github.com/postlight/lux/commit/7b1c48b4aa)] - **deps**: update eslint to version 3.9.0 🚀 (#489) (Greenkeeper)
*   [[`61c37cc4de`](https://github.com/postlight/lux/commit/61c37cc4de)] - **deps**: update source-map-support to version 0.4.6 (#492) (Greenkeeper)
*   [[`055bf5f5fe`](https://github.com/postlight/lux/commit/055bf5f5fe)] - **deps**: update babel-core to version 6.18.2 (#496) (Greenkeeper)
*   [[`63db399c8c`](https://github.com/postlight/lux/commit/63db399c8c)] - **deps**: update nyc to version 8.4.0 (#497) (Greenkeeper)
*   [[`26ba4e5a21`](https://github.com/postlight/lux/commit/26ba4e5a21)] - **deps**: update remark-lint to version 5.2.0 (#494) (Greenkeeper)
*   [[`46f223b77f`](https://github.com/postlight/lux/commit/46f223b77f)] - **deps**: update flow-bin to version 0.34.0 (#490) (Greenkeeper)
*   [[`71214e17ff`](https://github.com/postlight/lux/commit/71214e17ff)] - **deps**: update remark-cli to version 2.1.0 (#488) (Greenkeeper)
*   [[`748b26b577`](https://github.com/postlight/lux/commit/748b26b577)] - **deps**: update babel-eslint to version 7.1.0 (#487) (Greenkeeper)
*   [[`d98139e08c`](https://github.com/postlight/lux/commit/d98139e08c)] - **deps**: update eslint-plugin-flowtype to version 2.25.0 (#486) (Greenkeeper)
*   [[`40bea0b2d1`](https://github.com/postlight/lux/commit/40bea0b2d1)] - **deps**: update eslint-plugin-flowtype to version 2.24.0 (#485) (Greenkeeper)
*   [[`edaec79e12`](https://github.com/postlight/lux/commit/edaec79e12)] - **deps**: update babel-core to version 6.18.0 (#483) (Greenkeeper)
*   [[`ce25efdad7`](https://github.com/postlight/lux/commit/ce25efdad7)] - **deps**: update eslint-plugin-flowtype to version 2.23.1 (#484) (Greenkeeper)
*   [[`be7fef2034`](https://github.com/postlight/lux/commit/be7fef2034)] - **deps**: update eslint-plugin-flowtype to version 2.22.0 (#481) (Greenkeeper)
*   [[`3e578257f9`](https://github.com/postlight/lux/commit/3e578257f9)] - **release**: 1.0.2 🔧 (#480) (Zachary Golba)

### 1.0.2 (Oct 24, 2016)

##### Commits

*   [[`bbf68000ea`](https://github.com/postlight/lux/commit/bbf68000ea)] - **fix**: controllers are not properly resolving for resources with custom paths (#478) (Zachary Golba)
*   [[`1a52cc1cec`](https://github.com/postlight/lux/commit/1a52cc1cec)] - **deps**: update eslint-plugin-flowtype to version 2.21.0 (#479) (Greenkeeper)
*   [[`fe35b45935`](https://github.com/postlight/lux/commit/fe35b45935)] - **release**: 1.0.1 🔧 (#477) (Zachary Golba)

### 1.0.1 (Oct 20, 2016)

##### Commits

*   [[`f27eab4e66`](https://github.com/postlight/lux/commit/f27eab4e66)] - **fix**: readdir error is causing cli commands to fail (#476) (Zachary Golba)
*   [[`2deea84ab9`](https://github.com/postlight/lux/commit/2deea84ab9)] - **release**: 1.0.0 🎉 (#472) (Zachary Golba)

### 1.0.0 (Oct 20, 2016)

##### Commits

*   [[`34d9478323`](https://github.com/postlight/lux/commit/34d9478323)] - **deps**: update test-app dependencies (#475) (Zachary Golba)
*   [[`71dc913fb8`](https://github.com/postlight/lux/commit/71dc913fb8)] - **chore**: add markdown linter (#474) (Zachary Golba)
*   [[`0f1aa9fe69`](https://github.com/postlight/lux/commit/0f1aa9fe69)] - **deps**: update nyc to version 8.3.2 (#473) (Greenkeeper)
*   [[`0ca4477935`](https://github.com/postlight/lux/commit/0ca4477935)] - **docs**: fix link to guides in readme (#471) (Chris Watts)
*   [[`ea471aad7f`](https://github.com/postlight/lux/commit/ea471aad7f)] - **fix**: eslint config in compiler inherits from lux .eslintrc.json (#469) (Zachary Golba)
*   [[`2c74a0cc9c`](https://github.com/postlight/lux/commit/2c74a0cc9c)] - **docs**: add logo to readme (#470) (Zachary Golba)
*   [[`6656b9aca5`](https://github.com/postlight/lux/commit/6656b9aca5)] - **docs**: finalize public api docs for 1.0 release (#418) (Zachary Golba)
*   [[`7af75be54f`](https://github.com/postlight/lux/commit/7af75be54f)] - **deps**: update source-map-support to version 0.4.5 (#468) (Greenkeeper)
*   [[`362b196db3`](https://github.com/postlight/lux/commit/362b196db3)] - **deps**: update eslint to version 3.8.1 (#467) (Greenkeeper)
*   [[`d8833a9968`](https://github.com/postlight/lux/commit/d8833a9968)] - **deps**: update eslint-config-airbnb-base to version 9.0.0 🚀 (#464) (Greenkeeper)
*   [[`e0cde3bc20`](https://github.com/postlight/lux/commit/e0cde3bc20)] - **deps**: update babel-plugin-istanbul to version 2.0.3 (#465) (Greenkeeper)
*   [[`0b9b017a26`](https://github.com/postlight/lux/commit/0b9b017a26)] - **test**: improve logger test coverage (#452) (Zachary Golba)
*   [[`a343f87273`](https://github.com/postlight/lux/commit/a343f87273)] - **refactor**: ensure tableName is statically evaluated (#462) (Zachary Golba)
*   [[`fd60ff7b77`](https://github.com/postlight/lux/commit/fd60ff7b77)] - **deps**: update source-map-support to version 0.4.4 (#463) (Greenkeeper)
*   [[`b86a4cbe3d`](https://github.com/postlight/lux/commit/b86a4cbe3d)] - **deps**: update test-app dependencies (#461) (Zachary Golba)
*   [[`54db513fa3`](https://github.com/postlight/lux/commit/54db513fa3)] - **feat**: expose controller and action in public request api (#460) (Zachary Golba)
*   [[`e289ffc142`](https://github.com/postlight/lux/commit/e289ffc142)] - **feat**: add after-action middleware hook to controller (#459) (Zachary Golba)
*   [[`b74b52ff75`](https://github.com/postlight/lux/commit/b74b52ff75)] - **deps**: update mocha to version 3.1.2 (#458) (Zachary Golba)
*   [[`c14625a38c`](https://github.com/postlight/lux/commit/c14625a38c)] - **deps**: update eslint to version 3.8.0 🚀 (#457) (Greenkeeper)
*   [[`0a6c953345`](https://github.com/postlight/lux/commit/0a6c953345)] - **fix**: namespaced resources without root controllers/serializers is not… (#454) (Zachary Golba)
*   [[`a2bee41294`](https://github.com/postlight/lux/commit/a2bee41294)] - **fix**: compiler does not properly format class names for nested namespaces (#449) (Zachary Golba)
*   [[`adc723040c`](https://github.com/postlight/lux/commit/adc723040c)] - **deps**: update eslint-plugin-import to version 2.0.1 (#451) (Greenkeeper)
*   [[`c8995a2f75`](https://github.com/postlight/lux/commit/c8995a2f75)] - **test**: add unit tests for route definitions (#443) (Zachary Golba)
*   [[`ec18b7ac96`](https://github.com/postlight/lux/commit/ec18b7ac96)] - **deps**: update mocha to version 3.1.1 (#448) (Greenkeeper)
*   [[`f6a868bd77`](https://github.com/postlight/lux/commit/f6a868bd77)] - **deps**: update rollup to version 0.36.3 (#447) (Greenkeeper)
*   [[`3dfc2907e2`](https://github.com/postlight/lux/commit/3dfc2907e2)] - **fix**: remove unused plugins in lib/babel-hook (#444) (Zachary Golba)
*   [[`e7316c0df3`](https://github.com/postlight/lux/commit/e7316c0df3)] - **fix**: use path.sep to resolve root tmp dirs in fs tests (#442) (Zachary Golba)
*   [[`345e8c6b73`](https://github.com/postlight/lux/commit/345e8c6b73)] - **test**: add unit tests for controller utils (#441) (Zachary Golba)
*   [[`a4d9952984`](https://github.com/postlight/lux/commit/a4d9952984)] - **refactor**: make watcher a child of the fs package (#412) (Zachary Golba)
*   [[`20480fa1c9`](https://github.com/postlight/lux/commit/20480fa1c9)] - **deps**: update test-app dependencies (#440) (Zachary Golba)
*   [[`b3445ce5a4`](https://github.com/postlight/lux/commit/b3445ce5a4)] - **deps**: update nyc to version 8.3.1 (#439) (Greenkeeper)
*   [[`1bfd98e77a`](https://github.com/postlight/lux/commit/1bfd98e77a)] - **test**: run flow on appveyor builds (#432) (Zachary Golba)
*   [[`9e2f84bd2d`](https://github.com/postlight/lux/commit/9e2f84bd2d)] - **refactor**: use airbnb eslint rules (#434) (Zachary Golba)
*   [[`57101cfaf1`](https://github.com/postlight/lux/commit/57101cfaf1)] - **deps**: update eslint-plugin-flowtype to version 2.20.0 (#438) (Greenkeeper)
*   [[`bf213b49b8`](https://github.com/postlight/lux/commit/bf213b49b8)] - **deps**: update eslint to version 3.7.1 (#437) (Zachary Golba)
*   [[`84b7bd0d14`](https://github.com/postlight/lux/commit/84b7bd0d14)] - **deps**: update babel-preset-lux to version 1.3.0 (#436) (Greenkeeper)
*   [[`eaeb9eb983`](https://github.com/postlight/lux/commit/eaeb9eb983)] - **test**: enable parallel circleci builds (#435) (Zachary Golba)
*   [[`c8f05ee180`](https://github.com/postlight/lux/commit/c8f05ee180)] - **deps**: update babel-core to version 6.17.0 (#433) (Greenkeeper)
*   [[`856aeae646`](https://github.com/postlight/lux/commit/856aeae646)] - **test**: switch to circleci (#431) (Zachary Golba)
*   [[`0a49d14f1e`](https://github.com/postlight/lux/commit/0a49d14f1e)] - **deps**: update source-map-support to version 0.4.3 (#428) (Greenkeeper)
*   [[`339c35c864`](https://github.com/postlight/lux/commit/339c35c864)] - **deps**: update babel-core to version 6.16.0 (#427) (Zachary Golba)
*   [[`c3483ac1dc`](https://github.com/postlight/lux/commit/c3483ac1dc)] - chore(package): update babel-core to version 6.16.0 (greenkeeperio-bot)
*   [[`17780a1c6c`](https://github.com/postlight/lux/commit/17780a1c6c)] - **deps**: update babel-plugin-transform-es2015-modules-commonjs to version 6.16.0 (#430) (Greenkeeper)
*   [[`fd7bbe2f90`](https://github.com/postlight/lux/commit/fd7bbe2f90)] - **deps**: update flow-bin to version 0.33.0 🚀 (#429) (Greenkeeper)
*   [[`d3c67a51c8`](https://github.com/postlight/lux/commit/d3c67a51c8)] - **deps**: update rollup to version 0.36.1 (#426) (Greenkeeper)
*   [[`de8c3f16bb`](https://github.com/postlight/lux/commit/de8c3f16bb)] - **chore**: change ecmaVersion to 2017 in .eslintrc.json (#425) (Zachary Golba)
*   [[`32064c964e`](https://github.com/postlight/lux/commit/32064c964e)] - **deps**: update babel-eslint to version 7.0.0 (#424) (Greenkeeper)
*   [[`5fb4a42192`](https://github.com/postlight/lux/commit/5fb4a42192)] - **deps**: update mocha to version 3.1.0 (#423) (Greenkeeper)
*   [[`c7fe135343`](https://github.com/postlight/lux/commit/c7fe135343)] - **deps**: update eslint to version 3.6.1 (#422) (Greenkeeper)
*   [[`0e6ec39138`](https://github.com/postlight/lux/commit/0e6ec39138)] - **refactor**: cleanup unecessary controller props (#420) (Zachary Golba)
*   [[`a12bcad4c9`](https://github.com/postlight/lux/commit/a12bcad4c9)] - **deps**: update node-fetch to version 1.6.3 (#421) (Zachary Golba)
*   [[`85fc7fc82f`](https://github.com/postlight/lux/commit/85fc7fc82f)] - chore(package): update node-fetch to version 1.6.3 (greenkeeperio-bot)
*   [[`28b03d63f7`](https://github.com/postlight/lux/commit/28b03d63f7)] - **docs**: update examples (#419) (Zachary Golba)
*   [[`6b2f86da48`](https://github.com/postlight/lux/commit/6b2f86da48)] - **deps**: update sinon to version 1.17.6 (#416) (Zachary Golba)
*   [[`15c5ca0c0c`](https://github.com/postlight/lux/commit/15c5ca0c0c)] - **deps**: update node-fetch to version 1.6.2 (#415) (Greenkeeper)
*   [[`aa81af568c`](https://github.com/postlight/lux/commit/aa81af568c)] - **deps**: update eslint to version 3.6.0 (#414) (Greenkeeper)
*   [[`f0d660c599`](https://github.com/postlight/lux/commit/f0d660c599)] - **fix**: application keys being overwritten (#411) (Zachary Golba)
*   [[`585584d2f7`](https://github.com/postlight/lux/commit/585584d2f7)] - **test**: improve luxify test coverage (#409) (Zachary Golba)
*   [[`73579fb570`](https://github.com/postlight/lux/commit/73579fb570)] - **test**: add unit tests for route namespaces (#410) (Zachary Golba)
*   [[`29dab32f86`](https://github.com/postlight/lux/commit/29dab32f86)] - **test**: refactor serializer tests to improve coverage (#408) (Zachary Golba)
*   [[`999f64933c`](https://github.com/postlight/lux/commit/999f64933c)] - **deps**: update mysql2 to v1.1.0 in test-app (#413) (Zachary Golba)
*   [[`233d4a716c`](https://github.com/postlight/lux/commit/233d4a716c)] - **test**: add unit tests for relationships module in database package (#407) (Zachary Golba)
*   [[`ade16b5d5e`](https://github.com/postlight/lux/commit/ade16b5d5e)] - **deps**: update eslint-plugin-flowtype to version 2.19.0 (#406) (Greenkeeper)
*   [[`a11ee86f27`](https://github.com/postlight/lux/commit/a11ee86f27)] - **deps**: update rollup to version 0.36.0 (Greenkeeper)
*   [[`4d35d593bf`](https://github.com/postlight/lux/commit/4d35d593bf)] - **test**: improve overall test coverage (#287) (Zachary Golba)
*   [[`cd1e822817`](https://github.com/postlight/lux/commit/cd1e822817)] - **deps**: update eslint-plugin-flowtype to version 2.18.2 (#397) (Greenkeeper)
*   [[`bf5571db8f`](https://github.com/postlight/lux/commit/bf5571db8f)] - **deps**: update test-app dependencies (#395) (Zachary Golba)
*   [[`007fd125ae`](https://github.com/postlight/lux/commit/007fd125ae)] - **deps**: update eslint-plugin-flowtype to version 2.18.1 (#389) (Greenkeeper)
*   [[`b0bb089ae3`](https://github.com/postlight/lux/commit/b0bb089ae3)] - **deps**: update eslint-plugin-flowtype to version 2.17.1 (#387) (Greenkeeper)
*   [[`d1e42c47f4`](https://github.com/postlight/lux/commit/d1e42c47f4)] - **chore**: switch to bcryptjs instead of native bcrypt in social-network example (#383) (Zachary Golba)
*   [[`e4966fd1f7`](https://github.com/postlight/lux/commit/e4966fd1f7)] - **chore**: fix authentication in social-network example (#378) (Zachary Golba)
*   [[`bbbe317a44`](https://github.com/postlight/lux/commit/bbbe317a44)] - **deps**: update eslint to version 3.5.0 (#373) (Greenkeeper)
*   [[`271722efd2`](https://github.com/postlight/lux/commit/271722efd2)] - **deps**: update eslint-plugin-flowtype to version 2.16.1 (#372) (Greenkeeper)
*   [[`7a3b836d51`](https://github.com/postlight/lux/commit/7a3b836d51)] - **deps**: update rollup-plugin-eslint to version 3.0.0 (#370) (Greenkeeper)
*   [[`c823ce4da2`](https://github.com/postlight/lux/commit/c823ce4da2)] - **chore**: use bcrypt in social network example (#371) (Adrien Montfort)
*   [[`bc7eba0e44`](https://github.com/postlight/lux/commit/bc7eba0e44)] - **deps**: update eslint-plugin-flowtype to version 2.16.0 (#369) (Greenkeeper)
*   [[`15e21ec3bf`](https://github.com/postlight/lux/commit/15e21ec3bf)] - **deps**: update rollup-plugin-json to version 2.0.2 (#368) (Greenkeeper)
*   [[`9f1e3ef7db`](https://github.com/postlight/lux/commit/9f1e3ef7db)] - **deps**: update eslint-plugin-flowtype to version 2.15.0 (#367) (Greenkeeper)
*   [[`38081786f6`](https://github.com/postlight/lux/commit/38081786f6)] - **deps**: update eslint-plugin-flowtype to version 2.14.3 (#366) (Greenkeeper)
*   [[`77b623a257`](https://github.com/postlight/lux/commit/77b623a257)] - **release**: 1.0.0-rc.7 (#363) (Zachary Golba)

### 1.0.0-rc.7 (Sept 4, 2016)

This release implements a fix for a regression in `1.0.0-rc.6` where model migrations would include the formatted filename as the table name (i.e `'2016050414243335_create_posts'` instead of `'posts'`).

##### Commits

*   [[`7bd0f4d87b`](https://github.com/postlight/lux/commit/7bd0f4d87b)] - **chore**: update example applications (#361) (Zachary Golba)
*   [[`9bcecc5650`](https://github.com/postlight/lux/commit/9bcecc5650)] - **release**: 1.0.0-rc.6 (#360) (Zachary Golba)

### 1.0.0-rc.6 (Sept 4, 2016)

This release contains a number of bug fixes related to overriding default behavior such as custom actions, model-less controllers, etc. In addition to bug fixes this release contains some awesome new features.

##### Upgrading

Route definitions have changed quite a bit with the implementation of router namespaces. In order to upgrade you will have to remove any calls to `this.route` within the `app/routes.js` file.

Previously, `this.route` was a means of defining custom routes or just defining individual routes rather than a whole resource. It did not scale well to multiple namespaces and was kind of a clunky API to begin with.

To define a custom route within a resource you may do the following:

```javascript
export default function routes() {
  // Arbitrary Routes (i.e /{route})
  // GET /health => ApplicationController#health
  this.get('health');

  this.resource('posts', function () {
    // Member Routes (i.e /posts/:id/{route})
    this.member(function () {
      // GET /posts/1/comments => PostsController#comments()
      this.get('comments');

      // POST /posts/1/comments => PostsController#createComment()
      this.post('comments', 'createComment');
    });

    // Collection Routes (i.e /posts/{route})
    this.collection(function () {
      // GET /posts/drafts => PostsController#drafts()
      this.get('drafts');
    });
  });
}
```

To only define a subset of routes for a given resource you may now do the following as shortcut:

```javascript
export default function routes() {
  // GET /posts => 200 OK
  // GET /posts/1 => 200 OK
  // POST /posts => 404 Not Found
  // PATCH /posts/1 => 404 Not Found
  // DELETE /posts/1 => 404 Not Found
  this.resource('posts', {
    only: ['show', 'index']
  });
}
```

##### Features

###### Router Namespaces

You now have the ability to define namespaces with your routes. Common uses cases for defining a namespace within your routes include admin-only routes, requiring payment from a user, api versioning, etc.

**Generators**

To generate a resource within a namespace, include the namespace as part of the name argument passed to the `generate` command.

*Example:*

```bash
lux generate resource admin/posts
```

The command above will result in the following files being created:

*   `app/controllers/admin/posts`
*   `app/serializers/admin/posts`

If you do not already have an `ApplicationController` or `ApplicationSerializer` for a namespace, they will automatically be generated.

Also, the `generate` command will omit namespaces when generating a `Model` or `Migration`. If you generate a resource in a namespace that already has a `Model`, you will be given the choice to either overwrite or skip the `Model` or `Migration` files.

**Controllers**

You can think of a namespace as if it is it's own Lux application that you are mounting into it's parent namespace. Similar to how a `Controller` works in previous versions, a `Controller` within a namespace will merge it's middleware with the `ApplicationController` for the namespace it is a part of. If the `Controller` is the `ApplicationController` for a namespace, it will merge it's middleware with the `ApplicationController` of parent namespace if possible.

*Example:*

```javascript
/*********************
 * Namespace: 'Root' *
 * Path: '/'         *
 *********************/

import { Controller } from 'lux-framework';

class ApplicationController extends Controller {
  beforeAction = [
    async function sayHello({ logger }) {
      logger.info('Hello world!');
    }
  ];
}

class PostsController extends Controller {
  index() {
    return Post.isPublic();
  }
}
```

A `GET` request to `/posts` will result in the following functions (in this order) handling the request:

*   `sayHello`
*   `PostsController#index`

The `PostsController#index` action only gives us the posts that are publicly available. This is what we want, but we should have a way for user's with admin access to be able to see what has not been published yet. To accomplish this we will use a namespace.

```javascript
/**********************
 * Namespace: 'admin' *
 * Path: '/admin'     *
 **********************/

import { Controller } from 'lux-framework';

class AdminApplicationController extends Controller {
  beforeAction = [
    async function authenticate() {
      // Authenticate request...
    }
  ];
}

class AdminPostsController extends Controller {
  index() {
    return Post.all();
  }
}
```

A `GET` request to `/admin/posts` will result in the following functions (in this order) handling the request:

*   `sayHello`
*   `authenticate`
*   `AdminPostsController#index`

As you can see in the example above, namespaces allow you to isolate middleware functions in a `beforeAction` array to only execute at certain paths of your application. This is done behind the scenes with Lux and does not require you to use inheritance between your controllers. Inheritance is 100% opt-in so feel free to start from scratch while still gaining the benefit of shared middleware functions.

Sometimes it can be nice to use inheritance if we're only slightly changing the behavior of a `Controller`. Let's look at an example where the `AdminPostsController` extends the `PostsController`.

```javascript
import PostsController from 'app/controllers/posts';

class AdminPostsController extends PostsController {
  index(request, response) {
    return super.index(request, response).unscope('isPublic');
  }
}
```

In the example above we are able to simply remove the `isPublic` scope from the `#index()` action because we are using inheritance. This would be very helpful if we added additional logic to the `#index()` route that would have otherwise had to duplicate across `posts` routes in other namespaces.

Keep in mind, inheritance can be an anti-pattern if it takes you more work to override methods than it would be to start fresh.

**Serializers**

Serializers within a namespace work very similar to a `Controller`. The main difference being that it is not required to have a `Serializer` within each namespace. Serializers will resolve to their closest ancestor. That means that if you have a `PostsSerializer` for a `posts` resource at the root namespace, requests to `/admin/posts` will fall back to use the `PostsSerializer` if a `AdminPostsSerializer` is not found at `app/serializers/admin/posts.js`.

Serializers within a namespace are great for versioning an api. Over time some fields may become deprecated in your responses and using serializers in a namespace is a great way to solve this problem.

*Example:*

```javascript
/**********************
 * Namespace: 'v1' *
 * Path: '/v1'     *
 **********************/
import { Serializer } from 'lux-framework';

class V1PostsSerializer extends Serializer {
  attributes = [
    'body',
    'title',
    'deprecated'
  ];

  hasOne = [
    'author'
  ];

  haMany = [
    'comments'
  ];
}
```

As you can see above we have a `V1PostsSerializer` that has an attribute that we no longer wish to include in responses in the `v2` namespace. We can use a namespaces to help us accomplish this task.

```javascript
/**********************
 * Namespace: 'v2' *
 * Path: '/v2'     *
 **********************/

import V1PostsSerializer from 'app/serializers/v1/posts';

 class V2PostsSerializer extends V1PostsSerializer {
   attributes = [
     'body',
     'title'
   ];
 }
```

🎉 It's that simple. Requests to `/v1/posts` will include the `deprecated` attribute while requests to `/v2/posts` will not.


**Defining Namespaces**

To define a namespace in your application, you must specify it in the `app/routes.js` file.

```javascript
function routes() {
  this.resource('posts');

  this.namespace('admin', function () {
    this.resource('posts');
  });  
}
```

There is no limit to how many levels you nest namespaces. Lux will flatten the execution of functions nested within namespaces during application boot so feel free to go crazy.

```javascript
function routes() {
  this.namespace('a', function () {
    this.resource('posts');

    this.namespace('b', function () {
      this.resource('posts');

      this.namespace('c', function () {
        this.resource('posts');

        this.namespace('d', function () {
          this.resource('posts');
        });
      });
    });
  });
}
```

###### Persistence Checking

Previously, the only means of checking persistence was by checking if a Model has an dirty attributes. This was unsuitable for determining wether or not a record has been persisted to the database yet.

We have added `Model#isNew` and `Model#persisted` to handle this.

*Example:*

```javascript
import Post from 'app/models/posts';

let post = await Post.first();


/**
 * Check existing record's persistence...
 */
post.isDirty
// => false
post.isNew
// => false
post.persisted
// => true


/**
 * Check an existing record's persistence after an attribute has been changed...
 */
post.title = 'add ability to check if model has been saved';
// => 'add ability to check if model has been saved'
post.isDirty
// => true
post.isNew
// => false
post.persisted
// => false


await post.save();

/**
 * Check a recently saved record's persistence...
 */
post.isDirty
// => false
post.isNew
// => false
post.persisted
// => true


post = new Post({
  title: 'I have yet to be saved.'
});

/**
 * Check the persistence of a record that has yet to be saved...
 */
post.isDirty
// => false
post.isNew
// => true
post.persisted
// => false


/**
 * Check a new record that was created via the #create() method...
 */
post = await Post.create({
  title: 'I have yet to be saved.'
});

post.isDirty
// => false
post.isNew
// => false
post.persisted
// => true
```

###### Distinct Queries

🎉 You can now do distinct queries on a Model.

```javascript
import Post from 'app/models/post';

Post.distinct('title' /*, 'body', ...etc */).where({
  isPublic: true
});

// SELECT DISTINCT "posts"."title" AS "title" FROM "posts" WHERE "posts"."is_public" = TRUE
```

##### Commits

*   [[`361acd467f`](https://github.com/postlight/lux/commit/361acd467f)] - **deps**: update babel-preset-lux to version 1.2.0 (#359) (Greenkeeper)
*   [[`1adeb907df`](https://github.com/postlight/lux/commit/1adeb907df)] - **feat**: router namespaces (#338) (Zachary Golba)
*   [[`1f9094e5db`](https://github.com/postlight/lux/commit/1f9094e5db)] - **chore**: add appveyor badge to readme (#358) (Zachary Golba)
*   [[`af75c59062`](https://github.com/postlight/lux/commit/af75c59062)] - **chore**: remove unnecessary event emitter decl (#357) (Zachary Golba)
*   [[`ce5568297d`](https://github.com/postlight/lux/commit/ce5568297d)] - **deps**: update flow-bin to version 0.32.0 🚀 (#356) (Greenkeeper)
*   [[`48d1cf8cd9`](https://github.com/postlight/lux/commit/48d1cf8cd9)] - **chore**: improve ci set up (#350) (Zachary Golba)
*   [[`58a4c6ed04`](https://github.com/postlight/lux/commit/58a4c6ed04)] - **deps**: update rollup to version 0.34.13 (#355) (Greenkeeper)
*   [[`603c45a5ec`](https://github.com/postlight/lux/commit/603c45a5ec)] - **deps**: update rollup to version 0.34.11 (#353) (Greenkeeper)
*   [[`0e05e3d9b9`](https://github.com/postlight/lux/commit/0e05e3d9b9)] - **fix**: lux console fails when running on an npm linked version of the master branch (#349) (Zachary Golba)
*   [[`5d492f5cea`](https://github.com/postlight/lux/commit/5d492f5cea)] - **feat**: add #distinct() query method (#346) (Zachary Golba)
*   [[`d9e00625e6`](https://github.com/postlight/lux/commit/d9e00625e6)] - **feat**: add ability to check if model has been saved (#347) (Zachary Golba)
*   [[`6474d516b5`](https://github.com/postlight/lux/commit/6474d516b5)] - **deps**: update eslint to version 3.4.0 (#345) (Greenkeeper)
*   [[`482bfe272a`](https://github.com/postlight/lux/commit/482bfe272a)] - **deps**: update eslint-plugin-flowtype to version 2.11.4 (#344) (Greenkeeper)
*   [[`0e66aa5405`](https://github.com/postlight/lux/commit/0e66aa5405)] - **deps**: update flow-bin to version 0.31.1 🚀 (#341) (Greenkeeper)
*   [[`6e88a55c08`](https://github.com/postlight/lux/commit/6e88a55c08)] - **deps**: update babel-plugin-transform-es2015-modules-commonjs to version 6.14.0 (#343) (Greenkeeper)
*   [[`15b648aa77`](https://github.com/postlight/lux/commit/15b648aa77)] - **deps**: update babel-core to version 6.14.0 (#342) (Greenkeeper)
*   [[`d33e6e67c3`](https://github.com/postlight/lux/commit/d33e6e67c3)] - **deps**: update eslint-plugin-flowtype to version 2.11.1 (#339) (Greenkeeper)
*   [[`56e329f968`](https://github.com/postlight/lux/commit/56e329f968)] - **docs**: small readme typos/rephrasings (#330) (Kevin Barrett)
*   [[`bace2de2bd`](https://github.com/postlight/lux/commit/bace2de2bd)] - **fix**: errors occuring during application boot fail silently (#316) (Zachary Golba)
*   [[`b8c5815045`](https://github.com/postlight/lux/commit/b8c5815045)] - **deps**: update rollup to version 0.34.10 (#328) (Greenkeeper)
*   [[`20f18a3459`](https://github.com/postlight/lux/commit/20f18a3459)] - **Feat**: Ignoring build/dist folder (#327) (Adam Pash)
*   [[`98dcfe05ce`](https://github.com/postlight/lux/commit/98dcfe05ce)] - **deps**: update eslint-plugin-flowtype to version 2.7.1 (#326) (Greenkeeper)
*   [[`d28529ffc6`](https://github.com/postlight/lux/commit/d28529ffc6)] - **deps**: update rollup to version 0.34.9 (#324) (Greenkeeper)
*   [[`86ea773e88`](https://github.com/postlight/lux/commit/86ea773e88)] - **deps**: update eslint to version 3.3.1 (#323) (Greenkeeper)
*   [[`6501ad00a0`](https://github.com/postlight/lux/commit/6501ad00a0)] - **Fix**: Environment variables overwritten by lux CLI (#322) (Adam Pash)
*   [[`9868b3d54d`](https://github.com/postlight/lux/commit/9868b3d54d)] - **Feat**: Added ssl for database; fixed port (#319) (Adam Pash)
*   [[`55cc30ae2b`](https://github.com/postlight/lux/commit/55cc30ae2b)] - **Feat**: Added minimum node version to package.json template (#321) (Adam Pash)
*   [[`612b9ced7a`](https://github.com/postlight/lux/commit/612b9ced7a)] - **deps**: update eslint-plugin-flowtype to version 2.7.0 (#318) (Greenkeeper)
*   [[`039dda77f2`](https://github.com/postlight/lux/commit/039dda77f2)] - **deps**: update rollup to version 0.34.8 (#317) (Greenkeeper)
*   [[`2b2829fbca`](https://github.com/postlight/lux/commit/2b2829fbca)] - **fix**: model-less controllers prevent applications from starting (#315) (Zachary Golba)
*   [[`2c90cfa994`](https://github.com/postlight/lux/commit/2c90cfa994)] - **deps**: update test-app dependencies (#314) (Zachary Golba)
*   [[`e9df74a9ef`](https://github.com/postlight/lux/commit/e9df74a9ef)] - **chore**: update examples (#313) (Zachary Golba)
*   [[`d1fbddc7b0`](https://github.com/postlight/lux/commit/d1fbddc7b0)] - **release**: 1.0.0-rc.5 (#312) (Zachary Golba)


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

*   [[`30e3e2e6b9`](https://github.com/postlight/lux/commit/30e3e2e6b9)] - **fix**: id null check fails if using postgres (#308) (Adam Pash)
*   [[`d01c27eae5`](https://github.com/postlight/lux/commit/d01c27eae5)] - **feat**: adding support for urls in database config (#307) (Adam Pash)
*   [[`bf6a518239`](https://github.com/postlight/lux/commit/bf6a518239)] - **deps**: update eslint to version 3.3.0 (#310) (Greenkeeper)
*   [[`fb22a31c8a`](https://github.com/postlight/lux/commit/fb22a31c8a)] - **deps**: update eslint-plugin-flowtype to version 2.6.4 (#305) (Greenkeeper)
*   [[`8b416b748b`](https://github.com/postlight/lux/commit/8b416b748b)] - **deps**: update eslint-plugin-flowtype to version 2.6.3 (#303) (Greenkeeper)
*   [[`fd1d01ec1b`](https://github.com/postlight/lux/commit/fd1d01ec1b)] - **feat**: added CORS to config (#302) (Adam Pash)
*   [[`a04c0fdda9`](https://github.com/postlight/lux/commit/a04c0fdda9)] - **fix**: camel cased relationships do not resolve correctly (#300) (Zachary Golba)
*   [[`c90377052f`](https://github.com/postlight/lux/commit/c90377052f)] - **deps**: update eslint-plugin-flowtype to version 2.6.1 (#301) (Greenkeeper)
*   [[`386cd24270`](https://github.com/postlight/lux/commit/386cd24270)] - **feat**: setting default configuration (#299) (Adam Pash)
*   [[`99b48107d0`](https://github.com/postlight/lux/commit/99b48107d0)] - **deps**: update eslint-plugin-flowtype to version 2.4.1 (#296) (Greenkeeper)
*   [[`d11aafc5f8`](https://github.com/postlight/lux/commit/d11aafc5f8)] - **fix**: pad function is failing due to negative values (#295) (Zachary Golba)
*   [[`164daec01a`](https://github.com/postlight/lux/commit/164daec01a)] - **fix**: lining up stats in debug logger when ms length differs (#292) (Adam Pash)
*   [[`e33f742d0e`](https://github.com/postlight/lux/commit/e33f742d0e)] - **feat**: aliased app dir for easier imports (#293) (Adam Pash)
*   [[`14a9cea1f6`](https://github.com/postlight/lux/commit/14a9cea1f6)] - **feat**: added default fallback for CLI (#271) (Adam Pash)
*   [[`4ff3f81218`](https://github.com/postlight/lux/commit/4ff3f81218)] - **deps**: update mocha to version 3.0.2 (#291) (Greenkeeper)
*   [[`9e658e9daa`](https://github.com/postlight/lux/commit/9e658e9daa)] - **chore**: enable flow on windows (#286) (Zachary Golba)
*   [[`cceb67995d`](https://github.com/postlight/lux/commit/cceb67995d)] - **release**: 1.0.0-rc.4 (#285) (Zachary Golba)

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

*   `app/middleware`
*   `app/utils`

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

*   [[`62431679b2`](https://github.com/postlight/lux/commit/62431679b2)] - **deps**: update rollup to version 0.34.7 (#284) (Greenkeeper)
*   [[`0c12e8b754`](https://github.com/postlight/lux/commit/0c12e8b754)] - **fix**: indentation is off when using model generators (#281) (Zachary Golba)
*   [[`4d89474fce`](https://github.com/postlight/lux/commit/4d89474fce)] - **refactor**: remove bluebird in favor of native apis (#279) (Zachary Golba)
*   [[`241ae8993d`](https://github.com/postlight/lux/commit/241ae8993d)] - **refactor**: improve third party type declarations (#276) (Zachary Golba)
*   [[`5de7a0d6c3`](https://github.com/postlight/lux/commit/5de7a0d6c3)] - **fix**: empty n:m relationships loads every record instead of an empty array (#277) (Zachary Golba)
*   [[`48d2fb7377`](https://github.com/postlight/lux/commit/48d2fb7377)] - **deps**: update rollup to version 0.34.5 (#275) (Greenkeeper)
*   [[`6ea44c3aef`](https://github.com/postlight/lux/commit/6ea44c3aef)] - **deps**: update babel-core to version 6.13.2 (#273) (Greenkeeper)
*   [[`329309d9ec`](https://github.com/postlight/lux/commit/329309d9ec)] - **fix**: empty 'fields' params cause all keys of a resource to be exposed (#270) (Zachary Golba)
*   [[`a412aa7493`](https://github.com/postlight/lux/commit/a412aa7493)] - **deps**: update test-app dependencies (#268) (Zachary Golba)
*   [[`35f301c1d8`](https://github.com/postlight/lux/commit/35f301c1d8)] - **deps**: update babel-core to version 6.13.1 (#267) (Greenkeeper)
*   [[`d0f4f2bfd3`](https://github.com/postlight/lux/commit/d0f4f2bfd3)] - **Feat**: Added generator for utils (#262) (Adam Pash)
*   [[`2ead12a73a`](https://github.com/postlight/lux/commit/2ead12a73a)] - **deps**: update mocha to version 3.0.1 (#265) (Greenkeeper)
*   [[`94abf145d1`](https://github.com/postlight/lux/commit/94abf145d1)] - **Feat**: Added generator for middleware (#261) (Adam Pash)
*   [[`d9d008111c`](https://github.com/postlight/lux/commit/d9d008111c)] - **release**: 1.0.0-rc.3 (#264) (Zachary Golba)

### 1.0.0-rc.3 (Aug 3, 2016)

Shout out to @adampash for fixing a bug that prevents newly created Lux apps from successfully being built! 👏

##### Notable Changes

*   Newly created Lux projects no longer fail to build due to invalid config files.

##### Commits

*   [[`6b598748d0`](https://github.com/postlight/lux/commit/6b598748d0)] - **Fix**: Quoting quotes inside config template (#260) (Adam Pash)
*   [[`74416748e4`](https://github.com/postlight/lux/commit/74416748e4)] - **release**: 1.0.0-rc.2 (#253) (Zachary Golba)

### 1.0.0-rc.2 (Aug 2, 2016)

##### Notable Changes

*   Invalid parameters and malformed request bodies no longer fail silently.
*   Controller's now accept relationships for `create` and `update` actions.

##### Commits

*   [[`1172d562c5`](https://github.com/postlight/lux/commit/1172d562c5)] - **fix**: do not allow public route definitions to set private params (#252) (Zachary Golba)
*   [[`278ab5dda3`](https://github.com/postlight/lux/commit/278ab5dda3)] - **fix**: allow show action to be chained (#251) (Zachary Golba)
*   [[`4777e1a22e`](https://github.com/postlight/lux/commit/4777e1a22e)] - **chore**: update example apps (#250) (Zachary Golba)
*   [[`5f55d63b57`](https://github.com/postlight/lux/commit/5f55d63b57)] - **deps**: update eslint to version 3.2.2 (#248) (Greenkeeper)
*   [[`831a61c7a1`](https://github.com/postlight/lux/commit/831a61c7a1)] - **deps**: update rollup to version 0.34.3 (#249) (Greenkeeper)
*   [[`e49e7df0e6`](https://github.com/postlight/lux/commit/e49e7df0e6)] - **deps**: update all dependencies (#247) (Zachary Golba)
*   [[`f41007d873`](https://github.com/postlight/lux/commit/f41007d873)] - **deps**: update eslint to version 3.2.1 (#245) (Greenkeeper)
*   [[`62ee4be098`](https://github.com/postlight/lux/commit/62ee4be098)] - **deps**: update rollup-plugin-multi-entry to version 2.0.1 (#246) (Greenkeeper)
*   [[`32aa4484d0`](https://github.com/postlight/lux/commit/32aa4484d0)] - **deps**: update rollup to version 0.34.2 (#244) (Greenkeeper)
*   [[`82fb3ce32e`](https://github.com/postlight/lux/commit/82fb3ce32e)] - **deps**: update mocha to version 3.0.0 (#243) (Greenkeeper)
*   [[`e4de52d116`](https://github.com/postlight/lux/commit/e4de52d116)] - **refactor**: add better relationship support and refactor type systems (#229) (Zachary Golba)
*   [[`e5e4c7afde`](https://github.com/postlight/lux/commit/e5e4c7afde)] - **deps**: update rollup-plugin-node-resolve to version 2.0.0 (#242) (Greenkeeper)
*   [[`edefdb50be`](https://github.com/postlight/lux/commit/edefdb50be)] - **deps**: update rollup-plugin-node-resolve to version 1.7.3 (#241) (Greenkeeper)
*   [[`2d35a05c43`](https://github.com/postlight/lux/commit/2d35a05c43)] - **deps**: update ora to version 0.3.0 (#239) (Greenkeeper)
*   [[`6787f15135`](https://github.com/postlight/lux/commit/6787f15135)] - **deps**: update eslint to version 3.2.0 (#237) (Greenkeeper)
*   [[`aab024dc10`](https://github.com/postlight/lux/commit/aab024dc10)] - **deps**: update flow-bin to version 0.30.0 (#238) (Greenkeeper)
*   [[`4fcf1fcb54`](https://github.com/postlight/lux/commit/4fcf1fcb54)] - **deps**: update rollup-plugin-node-resolve to version 1.7.2 (#236) (Greenkeeper)
*   [[`dff620b617`](https://github.com/postlight/lux/commit/dff620b617)] - **deps**: update eslint-plugin-flowtype to version 2.4.0 (#235) (Greenkeeper)
*   [[`c1e1d69956`](https://github.com/postlight/lux/commit/c1e1d69956)] - **deps**: update babel-plugin-transform-es2015-modules-commonjs to version 6.11.5 (#234) (Greenkeeper)
*   [[`8c2494cd4b`](https://github.com/postlight/lux/commit/8c2494cd4b)] - **deps**: update babel-core to version 6.11.4 (#233) (Greenkeeper)
*   [[`7682b8720a`](https://github.com/postlight/lux/commit/7682b8720a)] - **deps**: update eslint to version 3.1.1 (#231) (Greenkeeper)
*   [[`6b62779f27`](https://github.com/postlight/lux/commit/6b62779f27)] - **fix**: pluralize fields resource name (#216) (Louis Person)
*   [[`44025b35f7`](https://github.com/postlight/lux/commit/44025b35f7)] - **deps**: update documentation (package) to version 4.0.0-beta8 (#228) (Zachary Golba)
*   [[`ef8a1f6e22`](https://github.com/postlight/lux/commit/ef8a1f6e22)] - **deps**: update pg to version 6.0.2 in test-app (#227) (Zachary Golba)
*   [[`4247194886`](https://github.com/postlight/lux/commit/4247194886)] - **feat**: deduce domain protocol from connection (#217) (Louis Person)
*   [[`cb5e45d342`](https://github.com/postlight/lux/commit/cb5e45d342)] - **deps**: update eslint to version 3.1.0 (#226) (Greenkeeper)
*   [[`d8ef797d46`](https://github.com/postlight/lux/commit/d8ef797d46)] - **refactor**: remove response stream in favor of res.end() (#225) (Zachary Golba)
*   [[`a8a5406995`](https://github.com/postlight/lux/commit/a8a5406995)] - **feat**: improve log messages and data (#213) (Zachary Golba)
*   [[`6cd3474a53`](https://github.com/postlight/lux/commit/6cd3474a53)] - **deps**: update flow-bin to version 0.29.0 (#224) (Greenkeeper)
*   [[`2960a4148a`](https://github.com/postlight/lux/commit/2960a4148a)] - **deps**: update source-map-support to version 0.4.2 (#220) (Greenkeeper)
*   [[`c06a677c81`](https://github.com/postlight/lux/commit/c06a677c81)] - **deps**: update eslint-plugin-flowtype to version 2.3.1 (#219) (Greenkeeper)
*   [[`e69f04f6d9`](https://github.com/postlight/lux/commit/e69f04f6d9)] - **feat**: check directory for valid directory structure (#215) (kev5873)
*   [[`a7960f6bea`](https://github.com/postlight/lux/commit/a7960f6bea)] - **deps**: update rollup to version 0.34.1 (#214) (Greenkeeper)
*   [[`9c7e24a6dd`](https://github.com/postlight/lux/commit/9c7e24a6dd)] - **refactor**: add flow comment to the top of decl files (#212) (Zachary Golba)
*   [[`fc325ea65b`](https://github.com/postlight/lux/commit/fc325ea65b)] - **refactor**: improve and simplify eslint rules (#209) (Zachary Golba)
*   [[`a8460e5d4c`](https://github.com/postlight/lux/commit/a8460e5d4c)] - **fix**: resource IDs must be strings (#211) (Louis Person)
*   [[`fd0a593bb1`](https://github.com/postlight/lux/commit/fd0a593bb1)] - **deps**: update rollup to version 0.34.0 (#210) (Greenkeeper)
*   [[`4cc248bed4`](https://github.com/postlight/lux/commit/4cc248bed4)] - **deps**: update test-app dependencies (#208) (Zachary Golba)
*   [[`81a30f76b9`](https://github.com/postlight/lux/commit/81a30f76b9)] - **feat**: improve proxy decl (#207) (Zachary Golba)
*   [[`99523b7a0d`](https://github.com/postlight/lux/commit/99523b7a0d)] - **deps**: update babel-eslint to version 6.1.2 (#206) (Greenkeeper)
*   [[`eca77d5e9f`](https://github.com/postlight/lux/commit/eca77d5e9f)] - **deps**: update rollup to version 0.33.2 (#205) (Greenkeeper)
*   [[`4bb1878b91`](https://github.com/postlight/lux/commit/4bb1878b91)] - **deps**: update babel-eslint to version 6.1.1 (#204) (Greenkeeper)
*   [[`3bb6e07431`](https://github.com/postlight/lux/commit/3bb6e07431)] - **fix**: errors is a top level member (#203) (Louis Person)
*   [[`370630c8d4`](https://github.com/postlight/lux/commit/370630c8d4)] - **deps**: update rollup to version 0.33.1 (#202) (Greenkeeper)
*   [[`3eb6790091`](https://github.com/postlight/lux/commit/3eb6790091)] - **deps**: update rollup-plugin-multi-entry to version 2.0.0 🚀 (#199) (Greenkeeper)
*   [[`dc2e232b94`](https://github.com/postlight/lux/commit/dc2e232b94)] - **deps**: update flow-bin to version 0.28.0 🚀 (#201) (Greenkeeper)
*   [[`000bf415a2`](https://github.com/postlight/lux/commit/000bf415a2)] - **deps**: update eslint to version 3.0.1 (#200) (Greenkeeper)
*   [[`14b7bab46c`](https://github.com/postlight/lux/commit/14b7bab46c)] - **docs**: update CHANGELOG.md to include docker images (#198) (Zachary Golba)
*   [[`236c3961f0`](https://github.com/postlight/lux/commit/236c3961f0)] - **docs**: update ROADMAP.md (#197) (Zachary Golba)
*   [[`1d3a7b29ae`](https://github.com/postlight/lux/commit/1d3a7b29ae)] - **docs**: update testing section of README.md (#196) (Zachary Golba)
*   [[`266b2120a2`](https://github.com/postlight/lux/commit/266b2120a2)] - **release**: 1.0.0-rc.1 (#195) (Zachary Golba)

### 1.0.0-rc.1 (July 4, 2016)

Happy Independence Day 🇺🇸

This release brings a few bug fixes and some of the features tracked in the [1.0 milestone](https://github.com/postlight/lux/issues?q=is%3Aopen+is%3Aissue+milestone%3A1.0). Special thanks to @kev5873 for finding and fixing a bug related to generating a new project with more than one dash in the title!

##### Features

###### Docker Images

🐳 We now have images on Docker Hub for seamless Lux development and deploying.

*   [Docker Hub](https://hub.docker.com/r/zacharygolba/lux-framework)
*   [GitHub](https://github.com/postlight/docker-lux)

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

*   [[`32c1b92d04`](https://github.com/postlight/lux/commit/32c1b92d04)] - **deps**: update moment to version 2.14.1 (#194) (Greenkeeper)
*   [[`e43e2e6c00`](https://github.com/postlight/lux/commit/e43e2e6c00)] - **deps**: update eslint to version 3.0.0 (#192) (Greenkeeper)
*   [[`40863b4fbd`](https://github.com/postlight/lux/commit/40863b4fbd)] - **fix**: display correct error messages from flow script (#191) (Zachary Golba)
*   [[`5aeb903196`](https://github.com/postlight/lux/commit/5aeb903196)] - **feat**: return a promise from relationships (#190) (Zachary Golba)
*   [[`38d7a9bcbf`](https://github.com/postlight/lux/commit/38d7a9bcbf)] - **feat**: add Query#first and Query#last (#189) (Zachary Golba)
*   [[`bceb825976`](https://github.com/postlight/lux/commit/bceb825976)] - **fix**: fixes #187 issue with class name generation with multiple dashes (#188) (kev5873)
*   [[`620ab46eae`](https://github.com/postlight/lux/commit/620ab46eae)] - **chore(package)**: update source-map-support to version 0.4.1 (#186) (Greenkeeper)
*   [[`22dfbaf03b`](https://github.com/postlight/lux/commit/22dfbaf03b)] - **release**: 1.0.0-rc (#185) (Zachary Golba)

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

*   `lux serve` does not start in cluster mode by default. To run your application as a cluster run `lux serve -c` or `lux serve --cluster`.

*   Commands that require an application build (`serve`, `db:*`, etc) now prefer strict mode and require you to specify `--use-weak` if you do not want to run in strict mode (you should pretty much always use strict mode).

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

*   [[`81f52fc1c8`](https://github.com/postlight/lux/commit/81f52fc1c8)] - **feat**: add luxify function for converting traditional middleware (#183) (Zachary Golba)
*   [[`39ce152574`](https://github.com/postlight/lux/commit/39ce152574)] - **fix**: index names sometimes exceed max length in generated migrations (#182) (Zachary Golba)
*   [[`fb5a71a897`](https://github.com/postlight/lux/commit/fb5a71a897)] - **feat**: add custom repl for debugging (#180) (Zachary Golba)
*   [[`c2b0b30d01`](https://github.com/postlight/lux/commit/c2b0b30d01)] - **feat**: do not cluster by default use -c || --cluster (#179) (Zachary Golba)
*   [[`785ebf1c39`](https://github.com/postlight/lux/commit/785ebf1c39)] - **fix**: regression from #177 local lux not being used in cli (#178) (Zachary Golba)
*   [[`67b9940e5c`](https://github.com/postlight/lux/commit/67b9940e5c)] - **feat**: add windows support (#177) (Zachary Golba)
*   [[`c4ab5e0b3b`](https://github.com/postlight/lux/commit/c4ab5e0b3b)] - **deps**: update rollup to version 0.33.0 (#176) (Greenkeeper)
*   [[`a7e860dd97`](https://github.com/postlight/lux/commit/a7e860dd97)] - **deps**: update rollup-plugin-babel to version 2.6.1 (#172) (Greenkeeper)
*   [[`68e7d8fafe`](https://github.com/postlight/lux/commit/68e7d8fafe)] - **deps**: update rollup-plugin-json to version 2.0.1 (#173) (Greenkeeper)
*   [[`7abf664c99`](https://github.com/postlight/lux/commit/7abf664c99)] - **deps**: update rollup-plugin-eslint to version 2.0.2 (#175) (Greenkeeper)
*   [[`f4e17aabf9`](https://github.com/postlight/lux/commit/f4e17aabf9)] - **deps**: update rollup-plugin-node-resolve to version 1.7.1 (#174) (Greenkeeper)
*   [[`c2a77c68d5`](https://github.com/postlight/lux/commit/c2a77c68d5)] - **deps**: update rollup to version 0.32.4 (#171) (Greenkeeper)
*   [[`b23873109b`](https://github.com/postlight/lux/commit/b23873109b)] - **deps**: update rollup-plugin-babel to version 2.6.0 (#169) (Greenkeeper)
*   [[`7ed59ab595`](https://github.com/postlight/lux/commit/7ed59ab595)] - **deps**: update rollup to version 0.32.2 (#168) (Greenkeeper)
*   [[`b25237a647`](https://github.com/postlight/lux/commit/b25237a647)] - **refactor**: use process.cwd() instead of process.env.PWD (#167) (Zachary Golba)
*   [[`5bab51a38b`](https://github.com/postlight/lux/commit/5bab51a38b)] - **deps**: update babel-eslint to version 6.1.0 (#165) (Greenkeeper)
*   [[`53cb1e53e2`](https://github.com/postlight/lux/commit/53cb1e53e2)] - **deps**: update rollup to version 0.32.1 (#164) (Greenkeeper)
*   [[`022b2e954c`](https://github.com/postlight/lux/commit/022b2e954c)] - **deps**: upgrade pg version in test-app (#166) (Zachary Golba)
*   [[`ef3f9ce8d3`](https://github.com/postlight/lux/commit/ef3f9ce8d3)] - **fix**: ensure lux is not an external dependency (#163) (Zachary Golba)
*   [[`fba8654d2e`](https://github.com/postlight/lux/commit/fba8654d2e)] - **deps**: update test-app dependencies (#162) (Zachary Golba)
*   [[`84160c9149`](https://github.com/postlight/lux/commit/84160c9149)] - **deps**: update babel-core to version 6.10.4 (#161) (Greenkeeper)
*   [[`7ee935afa1`](https://github.com/postlight/lux/commit/7ee935afa1)] - **deps**: update babel-eslint to version 6.0.5 (#160) (Greenkeeper)
*   [[`cd53552aca`](https://github.com/postlight/lux/commit/cd53552aca)] - **deps**: update eslint to version 2.13.1 (#159) (Greenkeeper)
*   [[`8e6a23dad3`](https://github.com/postlight/lux/commit/8e6a23dad3)] - **refactor**: improve build process and stack traces (#158) (Zachary Golba)
*   [[`6748638ca6`](https://github.com/postlight/lux/commit/6748638ca6)] - **refactor**: rename serializer methods and return objects (#155) (Zachary Golba)
*   [[`7597031076`](https://github.com/postlight/lux/commit/7597031076)] - **feat**: ensure Application#port is a number (#156) (Zachary Golba)
*   [[`2d83f30df6`](https://github.com/postlight/lux/commit/2d83f30df6)] - **deps**: update rollup to version 0.32.0 (#154) (Greenkeeper)
*   [[`64250ebe5b`](https://github.com/postlight/lux/commit/64250ebe5b)] - **refactor**: separate responsibilities in req/res flow (#153) (Zachary Golba)

### 0.0.1-beta.13 (June 18, 2016)

*   [[`30a60c10ca`](https://github.com/postlight/lux/commit/30a60c10ca)] - **chore**: bump version to 0.0.1-beta.13 (Zachary Golba)
*   [[`a569225072`](https://github.com/postlight/lux/commit/a569225072)] - **feat**: match ember-data jsonapi pagination implementation (#151) (Zachary Golba)
*   [[`ea4786b791`](https://github.com/postlight/lux/commit/ea4786b791)] - **deps**: update mysql2 to version 1.0.0-rc.5 in test-app (#150) (Zachary Golba)
*   [[`9b78c19540`](https://github.com/postlight/lux/commit/9b78c19540)] - **style**: change tabs to spaces in .eslintrc.js (#149) (Zachary Golba)
*   [[`853d81a5d5`](https://github.com/postlight/lux/commit/853d81a5d5)] - **deps**: update bluebird to version 3.4.1 (#147) (Greenkeeper)
*   [[`873f92dcac`](https://github.com/postlight/lux/commit/873f92dcac)] - **deps**: update eslint to version 2.13.0 (#146) (Greenkeeper)

### 0.0.1-beta.12 (June 13, 2016)

*   [[`723c403598`](https://github.com/postlight/lux/commit/723c403598)] - **feat**: generate basic .eslintrc.json with `lux new` cmd (Zachary Golba)
*   [[`952fa65db3`](https://github.com/postlight/lux/commit/952fa65db3)] - **deps**: update rollup to version 0.31.2 (#141) (Greenkeeper)
*   [[`07bdc43db1`](https://github.com/postlight/lux/commit/07bdc43db1)] - **docs**: update CHANGELOG.md (Zachary Golba)

### 0.0.1-beta.11 (June 12, 2016)

This is the last big set of breaking changes before a stable `1.0.0` release
and moving forward we will strictly follow semantic versioning.

If all goes well in this release the next release will be `1.0.0-rc` and will
only contain a few more features geared towards application profiling.

##### Commits

*   [[`30f962c003`](https://github.com/postlight/lux/commit/30f962c003)] - **deps**: update dependencies (Zachary Golba)
*   [[`b6700be793`](https://github.com/postlight/lux/commit/b6700be793)] - **refactor**: move query proxy to initializer function (Zachary Golba)
*   [[`b53c58a06f`](https://github.com/postlight/lux/commit/b53c58a06f)] - **chore**: update examples (Zachary Golba)
*   [[`2d0f2ef941`](https://github.com/postlight/lux/commit/2d0f2ef941)] - **feat**: support n:m relationships (Zachary Golba)
*   [[`93e3c0a14b`](https://github.com/postlight/lux/commit/93e3c0a14b)] - **feat**: add chainable query interface (Zachary Golba)
*   [[`425b8de4cc`](https://github.com/postlight/lux/commit/425b8de4cc)] - **feat**: use watchman for file watcher with fs.watch fallback (Zachary Golba)
*   [[`97bed29798`](https://github.com/postlight/lux/commit/97bed29798)] - **refactor**: remove all decorators from private and public APIs (Zachary Golba)
*   [[`53e257ae66`](https://github.com/postlight/lux/commit/53e257ae66)] - **refactor**: use lux babel preset (Zachary Golba)
*   [[`2512e857b2`](https://github.com/postlight/lux/commit/2512e857b2)] - **refactor**: use streams for Logger (Zachary Golba)
*   [[`4341f5cebd`](https://github.com/postlight/lux/commit/4341f5cebd)] - **refactor**: use rollup for build (Zachary Golba)
*   [[`6bc225ac87`](https://github.com/postlight/lux/commit/6bc225ac87)] - **feat**: add file watcher (Zachary Golba)
*   [[`5425c512e8`](https://github.com/postlight/lux/commit/5425c512e8)] - **feat**: add process manager (Zachary Golba)
*   [[`7d0463a3f0`](https://github.com/postlight/lux/commit/7d0463a3f0)] - **feat**: tree-shaking, native es6, and start of HMR work (Zachary Golba)
*   [[`82eab320d2`](https://github.com/postlight/lux/commit/82eab320d2)] - **docs**: start api documentation (Zachary Golba)
*   [[`7e4a38c781`](https://github.com/postlight/lux/commit/7e4a38c781)] - **deps**: update eslint to version 2.12.0 (#140) (Greenkeeper)
*   [[`6b8b29aea3`](https://github.com/postlight/lux/commit/6b8b29aea3)] - **deps**: update eslint to version 2.11.1 (#139) (Greenkeeper)
*   [[`ef8b36cb2f`](https://github.com/postlight/lux/commit/ef8b36cb2f)] - **deps**: update babel-core to version 6.9.1 (#137) (Greenkeeper)
*   [[`c5c812dc62`](https://github.com/postlight/lux/commit/c5c812dc62)] - **deps**: update eslint to version 2.11.0 (#135) (Greenkeeper)
*   [[`24033dcfb3`](https://github.com/postlight/lux/commit/24033dcfb3)] - **chore**: update eslint config (#133) (Zachary Golba)
*   [[`ed58e7a685`](https://github.com/postlight/lux/commit/ed58e7a685)] - **deps**: update mocha to version 2.5.3 (#132) (Greenkeeper)
*   [[`c76c51b802`](https://github.com/postlight/lux/commit/c76c51b802)] - **deps**: update mocha to version 2.5.2 (#130) (Greenkeeper)

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

*   [[`f2b63501c9`](https://github.com/postlight/lux/commit/f2b63501c9)] - **chore**: bump version to 0.0.1-beta.10 (Zachary Golba)
*   [[`00a139653b`](https://github.com/postlight/lux/commit/00a139653b)] - **refactor**: use webpack for build (#121) (Zachary Golba)
*   [[`47cfa90f02`](https://github.com/postlight/lux/commit/47cfa90f02)] - **deps**: update mocha to version 2.5.1 (#128) (Greenkeeper)
*   [[`bbf73047eb`](https://github.com/postlight/lux/commit/bbf73047eb)] - **docs**: remove node-orm2 references from ROADMAP.md (#126) (Zachary Golba)
*   [[`4338d05c3b`](https://github.com/postlight/lux/commit/4338d05c3b)] - **docs**: fix broken links in CHANGELOG.md (#125) (Zachary Golba)
*   [[`50c18275a0`](https://github.com/postlight/lux/commit/50c18275a0)] - **docs**: update code sample in README.md (#124) (Zachary Golba)
*   [[`940b53a7ed`](https://github.com/postlight/lux/commit/940b53a7ed)] - **chore**: add CHANGELOG.md (#123) (Zachary Golba)
*   [[`8837cb5064`](https://github.com/postlight/lux/commit/8837cb5064)] - **fix**: NODE_ENV is not being passed down to child processes (#122) (Zachary Golba)
*   [[`c9f2aef952`](https://github.com/postlight/lux/commit/c9f2aef952)] - **feat**: confirm overwriting files with lux generate cmd (#120) (Zachary Golba)
*   [[`06dffaf0cd`](https://github.com/postlight/lux/commit/06dffaf0cd)] - **chore**: .editorconfig file (#119) (Joan Piedra)
*   [[`a7f191003d`](https://github.com/postlight/lux/commit/a7f191003d)] - **feat**: improve error handling on missing controller & serializer files (#118) (Joan Piedra)
*   [[`1dd3ab64c4`](https://github.com/postlight/lux/commit/1dd3ab64c4)] - **refactor**: remove Base package (#117) (Zachary Golba)
*   [[`0f64cc864a`](https://github.com/postlight/lux/commit/0f64cc864a)] - **fix**: hasMany relationships are not eager loading properly (#116) (Zachary Golba)
*   [[`11cb766267`](https://github.com/postlight/lux/commit/11cb766267)] - **fix**: select statement not being optimized by fields param (#115) (Zachary Golba)
*   [[`ad3564fc8b`](https://github.com/postlight/lux/commit/ad3564fc8b)] - **fix**: pagination links break with an empty table (#114) (Zachary Golba)
*   [[`1b84009543`](https://github.com/postlight/lux/commit/1b84009543)] - **fix**: ignore hidden and non .js files in loader (#113) (Joan Piedra)
*   [[`6d97ca7545`](https://github.com/postlight/lux/commit/6d97ca7545)] - **fix**: using ?include is not working with multiple resources (#112) (Zachary Golba)
*   [[`ef8e779867`](https://github.com/postlight/lux/commit/ef8e779867)] - **fix**: defaultValue is not accounted for in #108 (#111) (Zachary Golba)
*   [[`71a1be6ccc`](https://github.com/postlight/lux/commit/71a1be6ccc)] - **fix**: column data not consistent across all dbms (#108) (Zachary Golba)
*   [[`7c897ae0f2`](https://github.com/postlight/lux/commit/7c897ae0f2)] - **fix**: multiple 'hasMany' 'type' values are incorrect in serialized data (#109) (Zachary Golba)
*   [[`a03cde5195`](https://github.com/postlight/lux/commit/a03cde5195)] - **chore**: update example apps (#105) (Zachary Golba)
*   [[`824caab17f`](https://github.com/postlight/lux/commit/824caab17f)] - **deps**: update ora to version 0.2.3 (#101) (Greenkeeper)

### 0.0.1-beta.9 (May 18, 2016)

*   [[`4002a5a64d`](https://github.com/postlight/lux/commit/4002a5a64d)] - **chore**: bump version to 0.0.1-beta.9 (#97) (Zachary Golba)
*   [[`a7e54aa4da`](https://github.com/postlight/lux/commit/a7e54aa4da)] - **fix**: middleware functions added in 'beforeAction' not executing (#95) (Zachary Golba)
*   [[`b16557647e`](https://github.com/postlight/lux/commit/b16557647e)] - **fix**: migration generator does not change - to _ (#96) (Zachary Golba)
*   [[`81cdd2108b`](https://github.com/postlight/lux/commit/81cdd2108b)] - **fix**: remove short -db flag from lux new cmd (#93) (Zachary Golba)
*   [[`71f4593fbb`](https://github.com/postlight/lux/commit/71f4593fbb)] - **refactor**: use chalk instead of colors (#92) (Zachary Golba)
*   [[`786872becb`](https://github.com/postlight/lux/commit/786872becb)] - **fix**: config generator uses double quotes (#89) (Zachary Golba)
*   [[`2fb314ad1b`](https://github.com/postlight/lux/commit/2fb314ad1b)] - **deps**: update bluebird to version 3.4.0 (#91) (Zachary Golba)
*   [[`d95fb392c2`](https://github.com/postlight/lux/commit/d95fb392c2)] - **deps**: update babel-preset-es2015 to version 6.9.0 (#90) (Zachary Golba)
*   [[`6c7b42ddad`](https://github.com/postlight/lux/commit/6c7b42ddad)] - **deps**: update babel-runtime to version 6.9.0 (#88) (Greenkeeper)
*   [[`095d12a100`](https://github.com/postlight/lux/commit/095d12a100)] - **deps**: update babel-plugin-transform-runtime to version 6.9.0 (#87) (Greenkeeper)
*   [[`9ef804ecd9`](https://github.com/postlight/lux/commit/9ef804ecd9)] - **deps**: update babel-core to version 6.9.0 (#86) (Greenkeeper)
*   [[`23251651e9`](https://github.com/postlight/lux/commit/23251651e9)] - **chore**: add keywords to package.json (#81) (Zachary Golba)
*   [[`418cadb662`](https://github.com/postlight/lux/commit/418cadb662)] - **chore**: add dependencies badge to README.md (#80) (Zachary Golba)
*   [[`af3e72b73e`](https://github.com/postlight/lux/commit/af3e72b73e)] - **deps**: Update all dependencies 🌴 (#79) (Greenkeeper)
*   [[`2560584a4f`](https://github.com/postlight/lux/commit/2560584a4f)] - **chore**: update roadmap to reflect changes in #65 (#78) (Zachary Golba)

### 0.0.1-beta.8 (May 14, 2016)

*   [[`6416c6c309`](https://github.com/postlight/lux/commit/6416c6c309)] - **feat**: implement custom orm on top of knex.js (#65) (Zachary Golba)
*   [[`d117376a46`](https://github.com/postlight/lux/commit/d117376a46)] - **test**: add sudo and correct g++ version for node 4+ in .travis.yml (#70) (Zachary Golba)
*   [[`9a293bd117`](https://github.com/postlight/lux/commit/9a293bd117)] - **feat**: use js instead of json for config files (#67) (John-Henry Liberty)
*   [[`720f0e1323`](https://github.com/postlight/lux/commit/720f0e1323)] - **test**: update travis to use npm link (#68) (John-Henry Liberty)
*   [[`2fc214c045`](https://github.com/postlight/lux/commit/2fc214c045)] - **feat**: use local lux install if one exists (#66) (Zachary Golba)

### 0.0.1-beta.7 (May 01, 2016)

*   [[`e35c430cdc`](https://github.com/postlight/lux/commit/e35c430cdc)] - **chore**: bump version to 0.0.1-beta.7 (#64) (Zachary Golba)
*   [[`ec0b60b191`](https://github.com/postlight/lux/commit/ec0b60b191)] - **fix**: HEAD and OPTIONS request result in a 404 (#63) (Zachary Golba)

### 0.0.1-beta.6 (April 28, 2016)

*   [[`4079b07269`](https://github.com/postlight/lux/commit/4079b07269)] - **chore**: bump version to 0.0.1-beta.6 (#61) (Zachary Golba)
*   [[`b94c526e87`](https://github.com/postlight/lux/commit/b94c526e87)] - **fix**: serialize hasMany relationships (#60) (Zachary Golba)
*   [[`2f5aa41c1a`](https://github.com/postlight/lux/commit/2f5aa41c1a)] - **chore**: test on node 6 (#58) (Zachary Golba)
*   [[`e26a900e43`](https://github.com/postlight/lux/commit/e26a900e43)] - **docs**: add ROADMAP.md (#57) (Zachary Golba)

### 0.0.1-beta.5 (April 22, 2016)

*   [[`8a21b472e0`](https://github.com/postlight/lux/commit/8a21b472e0)] - **chore**: bump version to 0.0.1-beta.5 (#55) (Zachary Golba)
*   [[`909e732b9a`](https://github.com/postlight/lux/commit/909e732b9a)] - **chore**: update dependencies (#54) (Zachary Golba)
*   [[`47ef4b87a8`](https://github.com/postlight/lux/commit/47ef4b87a8)] - **fix**: miss-match session key/secret error (#53) (Zachary Golba)
*   [[`e70a032c0f`](https://github.com/postlight/lux/commit/e70a032c0f)] - **fix**: strings w/ commas interpreted as an array for POST/PATCH (#49) (Zachary Golba)
*   [[`23da23d74d`](https://github.com/postlight/lux/commit/23da23d74d)] - **docs**: add npm package badge to README (#47) (Zachary Golba)
*   [[`0788e468a6`](https://github.com/postlight/lux/commit/0788e468a6)] - **test**: add unit/integration tests (#39) (Zachary Golba)
*   [[`498c951917`](https://github.com/postlight/lux/commit/498c951917)] - **chore**: add Gitter badge (#46) (The Gitter Badger)

### 0.0.1-beta.4 (April 21, 2016)

*   [[`77dcdbe03b`](https://github.com/postlight/lux/commit/77dcdbe03b)] - **chore**: bump version to 0.0.1-beta.4 (#45) (Zachary Golba)
*   [[`7c529fa235`](https://github.com/postlight/lux/commit/7c529fa235)] - **fix**: correct typo in README (#44) (Nic Young)
*   [[`0880a71d89`](https://github.com/postlight/lux/commit/0880a71d89)] - **fix**: globally disable orm2 cache (Zachary Golba)
*   [[`0bd7c8dfde`](https://github.com/postlight/lux/commit/0bd7c8dfde)] - **fix**: make ora a runtime dependency (#40) (Zachary Golba)
*   [[`30ca0c27d5`](https://github.com/postlight/lux/commit/30ca0c27d5)] - **feat**: add spinner for long running task (#38) (Albert Yu)

### 0.0.1-beta.3 (April 18, 2016)

*   [[`03958b98d1`](https://github.com/postlight/lux/commit/03958b98d1)] - **chore**: bump version to 0.0.1-beta.3 (#37) (Zachary Golba)
*   [[`10b782be1f`](https://github.com/postlight/lux/commit/10b782be1f)] - **fix**: logger date incorrect (#35) (kev5873)
*   [[`e9897371be`](https://github.com/postlight/lux/commit/e9897371be)] - **chore**: Link to Medium Article in Readme (#33) (Zachary Golba)

### 0.0.1-beta.2 (April 18, 2016)

*   [[`c073253cd0`](https://github.com/postlight/lux/commit/c073253cd0)] - **fix**: listening message dispatched before workers are ready (#34) (Zachary Golba)

### 0.0.1-beta.1 (April 17, 2016)

*   [[`5a734e79ce`](https://github.com/postlight/lux/commit/5a734e79ce)] - **fix**: shebang line not finding node on linux (#32) (Zachary Golba)

### 0.0.1-beta (April 07, 2016)

*   [[`4a193b86d2`](https://github.com/postlight/lux/commit/4a193b86d2)] - Initial Commit (Zachary Golba)
