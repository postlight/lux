export default (route, resource) => {
  resource('comments');
  resource('friendships');
  resource('posts');
  resource('reactions');
  resource('users');

  route('users/login', {
    method: 'POST',
    action: 'login'
  });

  route('users/logout', {
    method: 'DELETE',
    action: 'logout'
  });

  route('actions', {
    method: 'GET',
    action: 'index'
  });

  route('actions/:id', {
    method: 'GET',
    action: 'show'
  });

  route('notifications', {
    method: 'GET',
    action: 'index'
  });

  route('notifications/:id', {
    method: 'GET',
    action: 'show'
  });
};
