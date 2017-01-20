### Overview

The Controller class is responsible for taking in requests from the outside world and returning the appropriate response.

Think of a Controller as a server at a restaurant. A client makes a request to an application, that request is routed to the appropriate Controller and then the Controller interprets the request and returns data relative to what the client has request.

To create a controller, use the generate command.

```bash
lux generate controller user
```

After running the command above you should now have a controller with the name you provided in the `./app/controllers` directory.

```javascript
import { Controller, action } from 'lux-framework';

class PostsController extends Controller {

}

export default PostsController;
```


#### Actions

Controller actions are functions that call on a Controller in response to an incoming HTTP request. The job of Controller actions are to return the data that the Lux Application will respond with.

There is no special API for Controller actions. They are simply functions that return a value. If an action returns a Query or Promise the resolved value will be used rather than the immediate return value of the action.

Below you will find a table showing the different types of responses you can get from different action return values. Keep in mind, Lux is agnostic to whether or not the value is returned synchronously or resolved from a Promise.

 | Return/Resolved Value        | Response                                   |
 |------------------------------|--------------------------------------------|
 | `Array<Model>` or `Model`    | Serialized JSON String                     |
 | `Array` or `Object` Literal  | JSON String                                |
 | `String` Literal             | Plain Text                                 |
 | `Number` Literal             | [HTTP Status Code](https://goo.gl/T2lMc7)  |
 | `true`                       | [204 No Content](https://goo.gl/GxKoqz)    |
 | `false`                      | [401 Unauthorized](https://goo.gl/60QqCW)  |

 **Built-In Actions**

 Built-in actions refer to Controller actions that you get for free when extending the Controller class (`show`, `index`, `create`, `update`, `destroy`). These actions are highly optimized to load only the attributes and relationships that are defined in the resolved {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} for a Controller.

 If applicable, built-in actions support the following features described in the [JSON API specification](http://jsonapi.org/):

  - [Sorting](http://jsonapi.org/format/#fetching-sorting)
  - [Filtering](http://jsonapi.org/format/#fetching-filtering)
  - [Pagination](http://jsonapi.org/format/#fetching-pagination)
  - [Sparse Fieldsets](http://jsonapi.org/format/#fetching-sparse-fieldsets)
  - [Including Related Resources](http://jsonapi.org/format/#fetching-includes)

 **Extending Built-In Actions**

 Considering the amount of functionality built-in actions provide, you will rarely need to override the default behavior of a built-in action. In the event that you do need to override a built-in action, you have the ability to opt back into the built-in logic by calling the `super class`.

 Read actions such as `index` and `show` return a {{#crossLink 'Database.Query'}}Query{{/crossLink}} which allows us to chain methods to the `super` call. In the following example we will extend the default behavior of the `index` action to only match records that meet an additional hard-coded set of conditions. We will still be able to use all of the functionality that the built-in `index` action provides.

 ```javascript
 // app/controllers/posts.js
 import { Controller } from 'lux-framework';

 class PostsController extends Controller {
    index(request, response) {
      return super.index(request, response).where({
        isPublic: true
      });
    }
  }

  export default PostsController;
  ```

 **Custom Actions**

 Sometimes it is necessary to add a custom action to a Controller. Lux allows you to do so by adding an instance method to a Controller. In the following example you will see how to add a custom action with the name `check` to a Controller. We are implementing this action to use as a health check for the application so we want to return the `Number` literal `204`.

 ```javascript
 // app/controllers/health.js
 import { Controller } from 'lux-framework';

 class HealthController extends Controller {
   async check() {
     return 204;
   }
 }

 export default HealthController;
 ```

The example above is nice but we can make the code a bit more concise with an Arrow `Function`.

 ```javascript
 // app/controllers/health.js
 import { Controller } from 'lux-framework';

 class HealthController extends Controller {
   check = async () => 204;
 }

 export default HealthController;
 ```

Using an Arrow Function instead of a traditional method Controller can be useful when immediately returning a value. However, there are a few downsides to using an Arrow `Function` for a Controller action, such as not being able to call the `super class`. This can be an issue if you are looking to extend a built-in action.

Another use case for a custom action could be to return a specific scope of data from a Model. Let's implement a custom `drafts` route on a `PostsController`.

 ```javascript
 // app/controllers/posts.js
 import { Controller } from 'lux-framework';
 import Post from 'app/models/posts';

 class PostsController extends Controller {
   drafts() {
     return Post.where({
       isPublic: false
     });
   }
 }

 export default PostsController;
 ```

While the example above works, we would have to implement all the custom logic that we get for free with built-in actions. Since we aren't getting too crazy with our custom action we can likely just call the `index` action and chain a `.where()` to it.

 ```javascript
 // app/controllers/posts.js
 import { Controller } from 'lux-framework';

 class PostsController extends Controller {
   drafts(request, response) {
     return this.index(request, response).where({
       isPublic: false
     });
   }
 }

 export default PostsController;
 ```

Now we can sort, filter, and paginate our custom `drafts` route!

#### Middleware

Middleware can be a very powerful tool in many Node.js server frameworks. Lux is no exception. Middleware can be used to execute logic before a Controller action is executed.

Middleware functions behave similarly to Controller actions, however, they are expected to return `undefined`. If a middleware function returns a value other than `undefined` the request/response cycle will end before remaining middleware and/or Controller actions are executed. This makes middleware a very powerful tool for dealing with many common tasks, such as authentication.

To add a middleware function simply define an `async` `function` and add it to the `beforeAction` property.

 ```javascript
 // app/controllers/posts.js
 import { Controller } from 'lux-framework';

 class PostsController extends Controller {
   beforeAction = [
     async function authenticate(request) {
       if (!request.currentUser) {
         // 401 Unauthorized
         return false;
       }
     }
   ];
 }

 export default PostsController;
 ```

 **Scoping Middleware**

 Middleware is scoped by Controller and includes a parent Controller's middleware recursively until the parent Controller is the root `ApplicationController`. This allows you to implement custom logic that can be executed for resources, namespaces, or an entire Application.

 Let's say we want to require authentication for every route in our Application. All we have to do is move our authentication middleware function from the example above to the `ApplicationController`.

  ```javascript
  // app/controllers/application.js
  import { Controller } from 'lux-framework';

  class ApplicationController extends Controller {
    beforeAction = [
      async function authenticate(request) {
        if (!request.currentUser) {
          // 401 Unauthorized
          return false;
        }
      }
    ];
  }

  export default ApplicationController;
  ```

 **Modules**

 It is considered a best practice to define your middleware functions in separate file and export them for use throughout an Application. Typically this is done within an `app/middleware` directory.

   ```javascript
   // app/middleware/authenticate.js
   export default async function authenticate(request) {
     if (!request.currentUser) {
       // 401 Unauthorized
       return false;
     }
   }
   ```

 This keeps the Controller code clean, easier to read, and easier to modify.

   ```javascript
   // app/controllers/application.js
   import { Controller } from 'lux-framework';
   import authenticate from 'app/middleware/authenticate';

   class ApplicationController extends Controller {
     beforeAction = [
       authenticate
     ];
   }

   export default ApplicationController;
   ```

### Parameters

For security purposes, Lux requires you to whitelist parameters coming in from the outside world.

The following properties are used to whitelist parameters:

   - `sort`
   - `filter`
   - `query`
   - `params`


#### Pagination

Pagination is enabled by default for the Controller's `index` action.

To retrieve a given page, use the `page={number}` query param.

  **Example:**

  `/posts?page=2`

To limit results to a certain size per page, use the `limit={number}` query param.

  **Example:**

  `/posts?page=2&limit=5`


##### Default & Max Per Page

Currently to implement a default or max per page (`limit`) value, you have to write a middleware function. Before `0.0.1` stable is released there will be a value you can declare on your Controller such as `maxPerPage = 50;` and `defaultPerPage = 10;`


#### Sorting

By default, sorting is enabled on the Controller's `index` route with ALL of your Controller's Model's attributes.

The default sort attribute for a Lux Controller when referenced on the server is `createdAt` and `created-at` respectively on the client.

To sort a Controller's response, use the `sort` query param.

**Example:** `/posts?sort=name`

To sort in descending order, prefix the sort attribute with `-`.

**Example:** `/posts?sort=-name`

To explicitly define what you can and can't sort by, declare the attributes in an array of strings as the Controller's `sort` property.

```javascript
class PostsController extends Controller {
  sort = [
    'name',
    'createdAt',
    'updatedAt'
  ];
}
```

#### Filtering

By default, filtering is enabled on the Controller's `index` route with ALL of your Controller's Model's attributes.

To filter a Controller's response, use the `filter` query param.

**Example:** `/tasks?filter[completed]=true`

To explicitly define what you can and can't filter by, declare the attributes in an array of strings as the Controller's `filter` property.

```javascript
class TasksController extends Controller {
  filter = [
    'completed'
  ];
}
```

@module lux-framework
@namespace Lux
@class Controller
@constructor
@public
/
