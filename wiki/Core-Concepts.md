Before getting started with Lux, it's a good idea to get an overview of how the Lux framework works.

### Philosophies

##### Minimal API surface area

Lux uses JavaScript's standard library rather than creating a ton of functions you'll have to learn and remember.

It's just JavaScript. Once you learn how to use it, you'll rarely need to look at the docs.

##### Pure functions are awesome

Or more appropriately somewhat pure functions are awesome.

Serving content is done by returning objects, arrays, or other primitives rather than calling `res.end(/* content */);` and returning nothing.

##### Convention over configuration

[Rails](http://rubyonrails.org/) and [Ember](http://emberjs.com/) are great because they make hard decisions for you and make it possible to submit a PR on your first day at a new company. This is rare with Node server frameworks.

### Directory Structure

```
./app-name
├── app
│   ├── controllers
│   │   └── application.js
│   ├── index.js
│   ├── middleware
│   ├── models
│   ├── routes.js
│   ├── serializers
│   │   └── application.js
│   └── utils
├── config
│   ├── database.js
│   └── environments
│       ├── development.js
│       ├── production.js
│       └── test.js
├── db
│   ├── migrate
│   ├── seed.js
│   └── tester_app_dev_development.sqlite
├── dist
│   ├── boot.js
│   ├── bundle.js
│   └── bundle.js.map
└── package.json
```

### File Naming Convention

File names should be all lowercase and should use dashes rather than underscores or camel case.

Example: A `BlogPost` model would have the file name `blog-post.js`.
