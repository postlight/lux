export default function routes() {
  this.resource('comments');
  this.resource('posts');
  this.resource('reactions');
  this.resource('tags');
  this.resource('users');

  this.route('actions', {
    method: 'GET',
    action: 'index'
  });

  this.route('actions/:id', {
    method: 'GET',
    action: 'show'
  });

  this.route('notifications', {
    method: 'GET',
    action: 'index'
  });

  this.route('notifications/:id', {
    method: 'GET',
    action: 'show'
  });
}
