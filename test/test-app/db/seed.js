import faker from 'faker';

import Categorization from '../app/models/categorization';
import Comment from '../app/models/comment';
import Image from '../app/models/image';
import Post from '../app/models/post';
import Reaction, { REACTION_TYPES } from '../app/models/reaction';
import Tag from '../app/models/tag';
import User from '../app/models/user';
import Friendship from '../app/models/friendship';

import range from '../app/utils/range';

const {
  name,
  lorem,
  random,
  internet,
  image: {
    imageUrl
  },
  helpers: {
    randomize
  }
} = faker;

export default async function seed(transaction) {
  await Promise.all(
    Array.from(range(1, 100)).map(() => User.create({
      name: `${name.firstName()} ${name.lastName()}`,
      email: internet.email(),
      password: internet.password(randomize([...range(8, 127)]))
    }, transaction))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Friendship.create({
      followerId: randomize([...range(1, 100)]),
      followeeId: randomize([...range(1, 100)])
    }, transaction))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Post.create({
      body: lorem.paragraphs(),
      title: lorem.sentence(),
      userId: randomize([...range(1, 100)]),
      isPublic: random.boolean()
    }, transaction))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Image.create({
      url: imageUrl(),
      postId: randomize([...range(1, 100)])
    }, transaction))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Tag.create({
      name: lorem.word()
    }, transaction))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Categorization.create({
      postId: randomize([...range(1, 100)]),
      tagId: randomize([...range(1, 100)])
    }, transaction))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Comment.create({
      message: lorem.sentence(),
      edited: random.boolean(),
      userId: randomize([...range(1, 100)]),
      postId: randomize([...range(1, 100)])
    }, transaction))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Reaction.create({
      [`${randomize(['comment', 'post'])}Id`]: randomize([...range(1, 100)]),
      userId: randomize([...range(1, 100)]),
      type: randomize(REACTION_TYPES)
    }, transaction))
  );
};
