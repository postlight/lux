import TagsSerializer from 'app/serializers/tags';

class AdminTagsSerializer extends TagsSerializer {
  attributes = [
    'name',
    'createdAt',
    'updatedAt'
  ];
}

export default AdminTagsSerializer;
