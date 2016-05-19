export default async function authenticate(req, res) {
  const { modelName } = this;
  const { url, method, record, session } = req;
  const currentUserId = session.get('currentUserId');
  let authenticated = true;

  switch (modelName) {
    case 'action':
    case 'comment':
    case 'post':
    case 'reaction':
      switch (method) {
        case 'DELETE':
        case 'PATCH':
          authenticated = record.userId === currentUserId;
          break;

        case 'POST':
          authenticated = !!currentUserId;
          break;
      }
      break;

    case 'friendship':
      switch (method) {
        case 'DELETE':
        case 'PATCH':
        case 'POST':
          authenticated = !!currentUserId;
          break;
      }
      break;

    case 'user':
      if (/^(DELETE|PATCH)$/g.test(method)) {
        authenticated = url.pathname.includes('logout') ||
          currentUserId === record.id;
      }
      break;

    case 'notification':
      if (record) {
        authenticated = record.userId === currentUserId;
      } else {
        authenticated = false;
      }
      break;
  }

  return authenticated;
}
