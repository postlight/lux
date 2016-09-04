export default function routes() {
  this.resource('actions', {
    only: ['show', 'index']
  });

  this.resource('comments');

  this.resource('friendships', {
    only: ['create', 'destroy']
  });

  this.resource('notifications', {
    only: ['show', 'index']
  });

  this.resource('posts');
  this.resource('reactions');
  this.resource('tags');

  this.resource('users', function () {
    this.collection(function () {
      this.post('login');
    });
  });

  this.namespace('admin', function () {
    this.resource('actions');
    this.resource('comments');
    this.resource('friendships');
    this.resource('notifications');
    this.resource('posts');
    this.resource('reactions');
    this.resource('tags');
    this.resource('users');
  });
}
