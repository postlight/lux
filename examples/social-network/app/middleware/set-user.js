import User from '../models/user';

export default async function setUser(req, res) {
  const { method } = req;

  if (/^(PUT|POST)$/g.test(method)) {
    const {
      session,

      params: {
        data: {
          attributes
        }
      }
    } = req;

    if (attributes) {
      req.params.data.attributes = {
        ...attributes,
        user: await User.find(session.get('currentUserId'))
      };
    }
  }
}
