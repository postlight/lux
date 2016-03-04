export default async function authenticate(req, res) {
  const { url, method, record, session } = req;
  const resource = url.pathname.replace(/^\/(\w+)(\/.+)?$/g, '$1');
  const currentUserId = session.get('currentUserId');
  let authenticated = true;

  switch (resource) {
    case 'actions':
    case 'comments':
    case 'posts':
    case 'likes':
      switch (method) {
        case 'DELETE':
        case 'PATCH':
          authenticated = currentUserId === record.get('userId');
          break;

        case 'POST':
          authenticated = !!currentUserId;
          break;
      }
      break;

    case 'friendships':
      switch (method) {
        case 'DELETE':
        case 'PATCH':
          authenticated = currentUserId === record.get('friendId');
          break;

        case 'POST':
          authenticated = !!currentUserId;
          break;
      }
      break;

    case 'users':
      if (/^(DELETE|PATCH)$/g.test(method)) {
        authenticated = url.pathname.includes('logout') ||
          currentUserId === record.get('id');
      }
      break;

    case 'notifications':
      if (record) {
        authenticated = currentUserId === record.get('userId');
      } else {
        authenticated = !!currentUserId;
      }
      break;
  }

  return authenticated;
}
