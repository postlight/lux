#### Overview

The Serializer class is used to describe which attributes and relationships to include for a particular resource.

The attributes and relationships you declare in a Serializer will determine the attributes and relationships that will be included in the response from the resource that the Serializer represents.

You can create a Serializer by using the generate command. In the example below we're going to create a Serializer with the model named "posts":

```bash
lux generate serializer posts
```

Once you've run the command above you should have a model with the name you specified in your `./app/serializers` directory which contains the following:

```javascript
import { Serializer } from 'lux-framework';

class PostsSerializer extends Serializer {

}

export default UsersSerializer;
```

#### Attributes

You can add attributes to your serializer using an array assigned to the class property `attributes` like the example below.

```javascript
class UsersSerializer extends Serializer {
  attributes = [
    'name',
    'email',
    'username',
    'createdAt',
    'updatedAt'
  ];
}
```

Since the attributes required for a resource are declared ahead of time in a Serializer, Lux will optimize SQL queries for the resource to only include what the Serializer needs to build the response.

```javascript
import { Serializer } from 'lux-framework';

  class PostsSerializer extends Serializer {
    attributes = [
      'body',
      'title',
      'createdAt'
    ];
  }

  export default PostsSerializer;
  ```

The Serializer above would result in resources returned from the `/posts` endpoint to only include the `body`, `title`, and `createdAt` attributes. If we wanted include an additional attribute such as `isPublic`, we would have to add `'isPublic'` to the `attributes` property.

  ```javascript
  import { Serializer } from 'lux-framework';

  class PostsSerializer extends Serializer {
    attributes = [
      'body',
      'title',
      'isPublic',
      'createdAt'
    ];
  }

  export default PostsSerializer;
  ```

#### Associations

Similar to `attributes` you can declare associations by adding relationship names to either the `hasOne` or `hasMany` property arrays on a Serializer.

Serializers are not concerned with ownership when it comes to associations, so both `hasOne` and `belongsTo` associations can be specified in the `hasOne` array property.

```javascript
import { Model } from 'lux-framework';

 class Post extends Model {
   static hasOne = {
     image: {
       inverse: 'post'
     }
   };

   static hasMany = {
     tags: {
       inverse: 'posts',
       through: 'categorization'
     },

     comments: {
       inverse: 'post'
     }
   };

   static belongsTo = {
     user: {
       inverse: 'posts'
     }
   };
 }

 export default Post;
 ```

To include the `user` and `image` associations in the response returned from the `/posts` endpoint, we must specify both associations in the `hasOne` property array of the Serializer.

 ```javascript
 import { Serializer } from 'lux-framework';

 class PostsSerializer extends Serializer {
   hasOne = [
     'user',
     'image'
   ];
 }

 export default PostsSerializer;
 ```

If we wanted to also include the `tags` and `comments` in the response, we have to add a `hasMany` array property containing `'tags'` and `'comments'`.

 ```javascript
 import { Serializer } from 'lux-framework';

 class PostsSerializer extends Serializer {
   hasOne = [
     'user',
     'image'
   ];

   hasMany = [
     'tags',
     'comments'
   ];
 }

 export default PostsSerializer;
 ```

You no longer need to specify that `tags` is a many to many relationship using the `Categorization` model as a join table.

#### Including Related Resources

When requesting related resources for an endpoint, the included resource will follow the serialization rules defined by the included resources Serializer.

If we request that the `posts` association is included from the `/users` endpoint, we will only get the `attributes` that the `PostsSerializer` has defined even though the response is processed by the `UsersSerializer`.

#### Sparse Fieldsets

When a request specifies the fields that it would like included in the response, the fields **MUST** be declared in the `attributes` property array of the resources Serializer, or they will be ignored.

#### Namespaces

When using namespaces, you are not required to have a Serializer for each resource as long as a Serializer for the given resource can be resolved upstream.

For example, if you have a `posts` resource and you decide to implement an admin namespace, you only need to export an `AdminPostsSerializer` from `app/serializers/admin/posts.js` if you want to specify different attributes or relationships than the `PostsSerializer` exported from `app/serializers/posts.js`.

In the event that you do want to specify different attributes or relationships that the `PostsSerializer` exported from `app/serializers/posts.js`, you are not required to extend `PostsSerializer`.

 ```javascript
  import { Serializer } from 'lux-framework';

  class PostsSerializer extends Serializer {
    attributes = [
      'body',
      'title',
      'createdAt'
    ];

    hasOne = [
      'user',
      'image'
    ];

    hasMany = [
      'tags',
      'comments'
    ];
  }

  export default PostsSerializer;
  ```

To add the `isPublic` attribute to the response payload of requests to a `/admin/posts` endpoint we can do either of the following examples:

  ```javascript
  // app/serializers/admin/posts.js
  import PostsSerializer from 'app/serializers/posts';

  class AdminPostsSerializer extends PostsSerializer {
    attributes = [
      'body',
      'title',
      'isPublic',
      'createdAt'
    ];
  }

  export default AdminPostsSerializer;
  ```

OR

  ```javascript
  // app/serializers/admin/posts.js
  import { Serializer } from 'lux-framework';

  class AdminPostsSerializer extends Serializer {
    attributes = [
      'body',
      'title',
      'isPublic',
      'createdAt'
    ];

    hasOne = [
      'user',
      'image'
    ];

    hasMany = [
      'tags',
      'comments'
    ];
  }

  export default AdminPostsSerializer;
  ```

 Even with inheritance, the examples above are a tad repetitive. We can improve this code by exporting constants from `app/serializers/posts.js`.

  ```javascript
  import { Serializer } from 'lux-framework';

  export const HAS_ONE = [
    'user',
    'image'
  ];

  export const HAS_MANY = [
    'tags',
    'comments'
  ];

  export const ATTRIBUTES = [
    'body',
    'title',
    'createdAt'
  ];

  class PostsSerializer extends Serializer {
    hasOne = HAS_ONE;
    hasMany = HAS_MANY;
    attributes = ATTRIBUTES;
  }

  export default PostsSerializer;
  ```

If we choose to use inheritance, our code can look like this:

  ```javascript
  // app/serializers/admin/posts.js
  import PostsSerializer, { ATTRIBUTES } from 'app/serializers/posts';

  class AdminPostsSerializer extends PostsSerializer {
    attributes = [
      ...ATTRIBUTES,
      'isPublic'
    ];
  }

  export default AdminPostsSerializer;
  ```

If we choose not use inheritance, our code can look like this:

  ```javascript
  // app/serializers/admin/posts.js
  import { Serializer } from 'lux-framework';
  import { HAS_ONE, HAS_MANY, ATTRIBUTES } from 'app/serializers/posts';

  class AdminPostsSerializer extends PostsSerializer {
    hasOne = HAS_ONE;
    hasMany = HAS_MANY;

    attributes = [
      ...ATTRIBUTES,
      'isPublic'
    ];
  }

  export default AdminPostsSerializer;
  ```

  @module lux-framework
  @namespace Lux
  @class Serializer
  @constructor
  @public
 /
