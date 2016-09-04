// @flow
import range from '../../../src/utils/range';
import { getTestApp } from '../../utils/get-test-app';
import describeResource from '../../utils/describe-resource';

describeResource('posts', {
  attributes: [
    'body',
    'title',
    'created-at',
    'updated-at'
  ],
  hasOne: {
    user: [
      'name',
      'email'
    ]
  },
  hasMany: {
    tags: [
      'name'
    ],
    comments: [
      'edited',
      'message',
      'created-at',
      'updated-at'
    ],
    reactions: [
      'type',
      'created-at'
    ]
  }
});
