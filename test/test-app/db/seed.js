import Author from '../app/models/author';
import Post from '../app/models/post';

import range from '../app/utils/range';

export default async function seed() {
  await Promise.all(
    [1, 2].map(n => {
      return Author.create({
        name: `New Author ${n}`
      });
    })
  );

  await Promise.all(
    [...range(1, 50)].map(n => {
      return Post.create({
        body: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed...',
        title: `New Post ${n}`,
        isPublic: true,
        authorId: n < 25 ? 1 : 2
      });
    })
  );
}
