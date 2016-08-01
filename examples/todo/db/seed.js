import faker from 'faker';

import Task from '../app/models/task';
import List from '../app/models/list';

import range from '../app/utils/range';

const {
  date,
  hacker,
  random,
  company,

  helpers: {
    randomize
  }
} = faker;

export default async function seed() {
  await Promise.all(
    Array.from(range(1, 4)).map(() => List.create({
      name: `${company.bsAdjective()} tasks`
    }))
  );

  await Promise.all(
    Array.from(range(1, 100)).map(() => Task.create({
      name: hacker.phrase(),
      listId: randomize(Array.from(range(1, 4))),
      dueDate: date.future(),
      isCompleted: random.boolean()
    }))
  );
}
