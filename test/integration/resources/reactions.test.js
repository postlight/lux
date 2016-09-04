// @flow
import describeResource from '../../utils/describe-resource';

describeResource('reactions', {
  attributes: [
    'type',
    'created-at'
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
    ],
    comment: [
      'edited',
      'message',
      'created-at',
      'updated-at'
    ]
  }
});
