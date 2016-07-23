// @flow
import type Parameter from '../parameter';
import type ParameterGroup from './index';

export type ParameterGroup$opts = {
  path: string;
  required?: boolean;
};

export type ParameterGroup$contents = Parameter | ParameterGroup;
