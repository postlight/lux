// @flow
import describeResource from '../../utils/describe-resource';

describeResource('notifications', {
  attributes: [
    'unread',
    'message',
    'created-at',
    'updated-at'
  ],
  hasOne: {
    recipient: [
      'name',
      'email'
    ]
  }
});
