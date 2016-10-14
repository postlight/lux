#### Overview

Models wrap a typical [node-orm2](https://github.com/dresende/node-orm2) model in a ES2015 class to provide a more modern syntax.

To create a model, use the generate command. In the example below we're going to create a model named "user":

```bash
lux generate model user
```

Once you've run the command above you should have a model with the name you specified in the `./app/models` directory which contains the following:

```javascript
import { Model } from 'lux-framework';

class User extends Model {

}

export default User;
```

#### Associations

Declare your model's associations in an object assigned to the `static` class property `hasOne` or `hasMany`.

```javascript
class User extends Model {
  static hasOne = {
    account: {
      model: 'account',
      reverse: 'user'
    }
  };

  static hasMany = {
    posts: {
      model: 'post',
      reverse: 'author'
    }
  };
}
```

#### Hooks

Use hooks to call a certain function in response to a transaction happening to a model instance.

To declare a hook, add an async function to the object assigned to the `static` class property `hooks` with the name of the hook you would like to target.

```javascript
class User extends Model {
  static hooks = {
    async afterCreate() {
      // Send welcome email...
    }
  }
}
```
