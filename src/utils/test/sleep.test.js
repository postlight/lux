// @flow
import sleep from '../sleep';

describe('util sleep()', () => {
  const amount = 500;
  let time;

  beforeEach(() => {
    time = Date.now();
  });

  it('resolves with undefined', async () => {
    expect(await sleep(amount)).toBeUndefined();
  });

  it('sleeps for the correct amount of time', async () => {
    await sleep(amount);
    expect(Date.now() - time).toBeCloseTo(amount, 25);
  });
});
