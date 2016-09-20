import { Serializer } from 'LUX_LOCAL';

class ImagesSerializer extends Serializer {
  attributes = [
    'url'
  ];

  hasOne = [
    'post'
  ];
}

export default ImagesSerializer;
