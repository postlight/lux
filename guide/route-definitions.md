Routes are added in the function exported from ./app/routes.js.

This function takes two arguments route and resource which are also functions.

Declaring a route will add a single route to your application and requires you to provide the path as the first argument as well as the method and action in an options hash as the second argument. This function should only be used for defining custom routes.

Declaring a resource will add all CRUD routes for a controller to your application. The resource function only takes one argument and that is the name of the resource.

```javascript
export default function routes() {
  this.resource('posts');
  this.resource('users', function () {
    // GET /users/custom-route => UsersController#customRoute
    this.get('custom-route');
    // GET /users/custom-route => UsersController#myCustomAction
    this.get('custom-route', 'myCustomAction');
  });
}
```
