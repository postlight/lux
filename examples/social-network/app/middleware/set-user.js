export default function setUser(req, res) {
  const { method } = req;

  if (/^(PATCH|POST)$/g.test(method)) {
    const { session } = req;
    const { attributes } = req.params.data;

    if (attributes) {
      req.params.data.attributes = {
        ...attributes,
        userId: session.get('currentUserId')
      };
    }
  }
}
