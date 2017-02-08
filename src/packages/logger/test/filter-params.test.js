// @flow
import filterParams from '../request-logger/utils/filter-params';

describe('module "logger"', () => {
  describe('util filterParams()', () => {
    let params;
    let filter;

    beforeAll(() => {
      params = {
        id: 1,
        username: 'test',
        password: 'test'
      };

      filter = [
        'username',
        'password'
      ];
    });

    it('replaces the value of filtered params', () => {
      expect(filterParams(params, ...filter)).toEqual(
        expect.objectContaining({
          username: expect.stringMatching(`^(?!${params.username})$`),
          password: expect.stringMatching(`^(?!${params.password})$`),
        })
      );
    });

    it('leaves non-filtered params unchanged', () => {
      expect(filterParams(params, ...filter)).toEqual(
        expect.objectContaining({
          id: params.id,
        })
      );
    });

    it('handles nested parameters', () => {
      expect(filterParams({ params }, ...filter)).toEqual({
        params: expect.objectContaining({
          username: expect.stringMatching(`^(?!${params.username})$`),
          password: expect.stringMatching(`^(?!${params.password})$`),
        })
      });
    });
  });
});
