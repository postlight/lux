/* @flow */

import sleep from '../sleep';

const AMOUNT = 500;

jest.useFakeTimers();

describe('util sleep()', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('resolves with undefined', async () => {
    const result = sleep(AMOUNT);

    jest.runAllTimers();

    expect(await result).toBeUndefined();
  });

  it('sleeps for the correct amount of time', async () => {
    sleep(AMOUNT);

    jest.runAllTimers();

    expect(setTimeout.mock.calls).toHaveLength(1);
    expect(setTimeout.mock.calls).toMatchSnapshot();
  });
});
