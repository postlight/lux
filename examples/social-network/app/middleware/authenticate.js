export default async function authenticate(req, res) {
  const { url, method, record, session } = req;
  const currentUserId = session.get('currentUserId');
  let authenticated = true;

  switch (this.modelName) {
    case 'actions':
    case 'comments':
    case 'posts':
    case 'likes':
      switch (method) {
        case 'DELETE':
        case 'PATCH':
          authenticated = record.user && record.user.id === currentUserId;
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
        case 'POST':
          authenticated = !!currentUserId;
          break;
      }
      break;

    case 'users':
      if (/^(DELETE|PATCH)$/g.test(method)) {
        authenticated = url.pathname.includes('logout') ||
          currentUserId === record.id;
      }
      break;

    case 'notifications':
      if (record) {
        authenticated = record.user && record.user.id === currentUserId;
      } else {
        authenticated = !!currentUserId;
      }
      break;
  }

  return authenticated;
}
