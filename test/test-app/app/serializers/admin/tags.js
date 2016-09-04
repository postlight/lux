import TagsSerializer from 'app/serializers/tags.js';

class AdminTagsSerializer extends TagsSerializer {
  attributes = [
    'name',
    'createdAt',
    'updatedAt'
  ];
}

export default AdminTagsSerializer;
