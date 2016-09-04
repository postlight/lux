// @flow
import describeResource from '../../utils/describe-resource';

describeResource('comments', {
  attributes: [
    'edited',
    'message',
    'created-at',
    'updated-at'
  ],
  hasOne: {
    user: [
      'name',
      'email'
    ],
    post: [
      'body',
      'title',
      'created-at',
      'updated-at'
    ]
  },
  hasMany: {
    reactions: [
      'type',
      'created-at'
    ]
  }
});
