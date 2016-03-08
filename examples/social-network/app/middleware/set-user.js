export default async function setUser(req, res) {
  const { method } = req;

  if (/^(PUT|POST)$/g.test(method)) {
    const { session } = req;
    const { attributes } = req.params.data;

    if (attributes) {
      const userId = session.get('currentUserId');

      req.params.data.attributes = {
        ...attributes,
        user: await this.store.findRecord('user', userId)
      };
    }
  }
}
