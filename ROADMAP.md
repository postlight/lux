# Roadmap

In this document you will find a proposed list of features that will be released during the Lux `1.0` lifecycle.


## Router Namespaces

Similar to [Rails](http://guides.rubyonrails.org/routing.html#controller-namespaces-and-routing), Lux should provide a simple API for defining a router namespace. There are a number of common use cases for router namespaces that make this feature a must. API versioning and a simple way to define "Admin Only" are two good examples.

#### API

##### Routes

Defining router namespaces will be done in the `routes.js` file where you currently define your applications resources and routes.

Similar to the `resource` and `route` arguments, the `namespace` argument will also be a function.

```javascript
// ./app/routes.js
export default function routes() {
  this.resource('posts');

  this.namespace('admin', function admin(route, resource) {
    this.resource('posts');
  });
}
```

There will also be the ability to pass an options hash as the second argument to the `namespace` function with properties such as `mount` in case the name of a declared namespace is different from the intended mount point.

```javascript
// ./app/routes.js
export default function routes() {
  this.namespace('legacy', {
    mount: 'v1'
  }, function legacy() {
    this.resource('posts');
  });

  this.namespace('current', {
    mount: 'v2'
  }, function current() {
    this.resource('posts');
  });
}
```

##### Controllers

When you declare a namespace, Lux will expect that namespace to have it's own directory and `ApplicationController` in the `./controllers` directory.

```
controllers
├── admin
│   ├── application.js
│   └── posts.js
├── application.js
└── posts.js
```

This is the difference between a namespace and nested route. Namespaces have an `ApplicationController` unique to the namespace. This allows for middleware to be declared at the namespace level.

```javascript
// ./app/controllers/application.js
class ApplicationController extends Controller {
  beforeAction = [
    async function authorizeUser(req, res) {
      // Ensure a user is logged in.
    }
  ];
}

// ./app/controllers/admin/application.js
class AdminController extends Controller {
  beforeAction = [
    async function authorizeAdmin(req, res) {
      // Ensure an admin is logged in.
    }
  ];
}
```

##### Nesting

Namespaces nesting will be supported without a limit to the level of nesting. Even though middleware appears to be a nested tree structure during the declaration, Lux will flatten and cache these functions as a one dimensional array upon the application's boot sequence.

Here is the middleware that would be executed when a user visits `/posts`

```javascript
[
  authorizeUser,
  PostsController.index
]
```

Here is the middleware that would be executed when a user visits `/admin/posts`

```javascript
[
  authorizeUser,
  authorizeAdmin,
  AdminPostsController.index
]
```

[\* Middleware flattening already is implemented in the current release of Lux.](https://github.com/postlight/lux/blob/master/src/packages/route/utils/create-action.js#L31)


## Polymorphic Relationships (#75)

#### API

Declaring a polymorphic relationship on a model should be as simple as a boolean flag.

```javascript
class Comment extends Model {
  static hasOne = {
    commentable: {
      polymorphic: true
    }
  }
}

class Post extends Model {
  static hasMany = {
    comments: {
      model: 'comment',
      inverse: 'commentable'
    }
  }
}
```

The example above would create the columns `commentable_id` and `commentable_type` on the `comments` table.


--


## In Progress

Below is a list of features that will likely be a part of the `1.0` release but their API is still in very early stages.

- WebSockets
  - Controller API
  - Model Hook API

- Application Testing
  - Test Generators
  - Debugging Tools
  - ~~Generated SQL Logging ([#48](https://github.com/postlight/lux/issues/48))~~
    - Implemented in #65
