import faker from 'faker';
import { capitalize } from 'inflection';

import Task from '../app/models/task';
import List from '../app/models/list';

import range from '../app/utils/range';

export default async () => {
  await Promise.all(
    [...range(1, 4)].map(() => {
      return List.create({
        name: `${capitalize(faker.company.bsAdjective())} Tasks`
      });
    })
  );

  await Promise.all(
    [...range(1, 100)].map(() => {
      return Task.create({
        name: faker.hacker.phrase(),
        listId: faker.helpers.randomize([...range(1, 4)]),
        dueDate: faker.date.future(),
        isCompleted: faker.random.boolean()
      })
    })
  );
};
