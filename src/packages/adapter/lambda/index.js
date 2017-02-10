import type { AdapterFactory } from '../index';

const lambda: AdapterFactory = () => () => (
  Promise.resolve([
    {},
    {}
  ])
);

export default lambda;
