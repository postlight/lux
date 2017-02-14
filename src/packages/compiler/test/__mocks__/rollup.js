// @flow
export const rollup = jest.fn();

rollup.mockReturnValue({
  write: jest.fn(),
});
