// @flow
import filterParams from '../request-logger/utils/filter-params';

describe('module "logger"', () => {
  describe('util filterParams()', () => {
    const params = {
      id: 1,
      username: 'test',
      password: 'test'
    };

    const filter = [
      'username',
      'password'
    ];

    it('replaces the value of filtered params', () => {
      expect(filterParams(params, ...filter)).toMatchSnapshot();
    });

    it('leaves non-filtered params unchanged', () => {
      expect(filterParams(params, ...filter)).toMatchSnapshot();
    });

    it('handles nested parameters', () => {
      expect(filterParams({ params }, ...filter)).toMatchSnapshot();
    });
  });
});
