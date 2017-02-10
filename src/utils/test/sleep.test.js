// @flow
import sleep from '../sleep';
import range from '../range';

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
    expect(Array.from(range(475, 525))).toContain(Date.now() - time);
  });
});
