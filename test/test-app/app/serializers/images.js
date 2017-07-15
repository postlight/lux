import { Serializer } from 'lux-framework'

class ImagesSerializer extends Serializer {
  attributes = [
    'url'
  ];

  hasOne = [
    'post'
  ];
}

export default ImagesSerializer
