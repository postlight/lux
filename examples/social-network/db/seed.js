import faker from 'faker';

import Categorization from '../app/models/categorization';
import Comment from '../app/models/comment';
import Post from '../app/models/post';
import Reaction from '../app/models/reaction';
import Tag from '../app/models/tag';
import User from '../app/models/user';
import Friendship from '../app/models/friendship';

import range from '../app/utils/range';

const {
  name,
  lorem,
  random,
  internet,
  helpers: {
    randomize
  }
} = faker;

export default async function seed(trx) {
  await Promise.all(
    Array.from(range(1, 100)).map(() => (
      User.transacting(trx).create({
        name: `${name.firstName()} ${name.lastName()}`,
        email: internet.email(),
        password: internet.password(randomize([...range(8, 127)]))
      })
    ))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => (
      Friendship.transacting(trx).create({
        followerId: randomize([...range(1, 100)]),
        followeeId: randomize([...range(1, 100)])
      })
    ))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => (
      Post.transacting(trx).create({
        body: lorem.paragraphs(),
        title: lorem.sentence(),
        userId: randomize([...range(1, 100)]),
        isPublic: random.boolean()
      })
    ))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => (
      Tag.transacting(trx).create({
        name: lorem.word()
      })
    ))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => (
      Categorization.transacting(trx).create({
        postId: randomize([...range(1, 100)]),
        tagId: randomize([...range(1, 100)])
      })
    ))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => (
      Comment.transacting(trx).create({
        message: lorem.sentence(),
        edited: random.boolean(),
        userId: randomize([...range(1, 100)]),
        postId: randomize([...range(1, 100)])
      })
    ))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => (
      Reaction.transacting(trx).create({
        [`${randomize(['comment', 'post'])}Id`]: randomize([...range(1, 100)]),
        userId: randomize([...range(1, 100)]),
        type: randomize([
          ':+1:',
          ':heart:',
          ':confetti_ball:',
          ':laughing:',
          ':disappointed:'
        ])
      })
    ))
  );
};
