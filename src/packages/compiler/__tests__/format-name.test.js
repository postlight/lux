// @flow
import { getTestApp } from '../../../../test/utils/test-app';
import formatName from '../utils/format-name';

describe('module "compiler"', () => {
  describe('util formatName()', () => {
    let keys: Array<string>;
    let app;

    beforeAll(async () => {
      app = await getTestApp();
      keys = [...app.controllers.keys()];
    });

    afterAll(async () => {
      await app.destroy();
    });

    it('transforms an array of keys into identifiers', () => {
      expect(keys.map(formatName).sort()).toEqual([
        'Actions',
        'Admin$Actions',
        'Admin$Application',
        'Admin$Categorizations',
        'Admin$Comments',
        'Admin$Friendships',
        'Admin$Images',
        'Admin$Notifications',
        'Admin$Posts',
        'Admin$Reactions',
        'Admin$Tags',
        'Admin$Users',
        'Application',
        'Categorizations',
        'Comments',
        'Custom',
        'Friendships',
        'Health',
        'Images',
        'Notifications',
        'Posts',
        'Reactions',
        'Tags',
        'Users'
      ]);
    });
  });
});
