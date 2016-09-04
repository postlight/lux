// @flow
import describeResource from '../../utils/describe-resource';

describeResource('tags', {
  attributes: [
    'name'
  ],
  hasOne: {
    posts: [
      'body',
      'title',
      'created-at',
      'updated-at'
    ]
  }
});
