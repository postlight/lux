import { Readable } from 'stream';

import {
  camelize,
  underscore,
  dasherize,
  pluralize,
  capitalize
} from 'inflection';

import Base from '../base';

import omit from '../../utils/omit';

import bound from '../../decorators/bound';

const { isArray } = Array;
const { entries } = Object;

class Serializer extends Base {
  hasOne = [];

  hasMany = [];

  attributes = [];

  nameFor(item) {
    const name = item.$modelOptions.name;

    return name ? camelize(name.singular, true) : 'object';
  }

  attributesFor(item) {
    let attrs = omit(item.dataValues, 'id',
      ...this.hasOne.map(relatedKey => {
        return`${capitalize(relatedKey)}Id`;
      })
    );

    if (this.attributes.length) {
      attrs = {};

      for (let attr of this.attributes) {
        attrs[this.formatKey(attr)] = item.get(attr);
      }
    }

    return attrs;
  }

  relationshipsFor(item) {
    const hash = {};

    for (let related of this.hasOne) {
      hash[related] = item[camelize(related)];
    }

    for (let related of this.hasMany) {
      hash[related] = item[camelize(related)];
    }

    return hash;
  }

  formatKey(key) {
    return dasherize(underscore(key));
  }

  serializeGroup(stream, key, data) {
    stream.push(`"${this.formatKey(key)}":`);

    if (key === 'data') {
      if (isArray(data)) {
        stream.push('[');

        data
          .map(this.serializeOne)
          .forEach((chunk, index, a) => {
            stream.push(chunk);
            if (index !== a.length - 1) {
              stream.push(',');
            }
          });

        stream.push(']');
      } else {
        stream.push(this.serializeOne(data));
      }
    } else {
      stream.push(JSON.stringify(data));
    }
  }

  async serializePayload(payload, stream) {
    try {
      stream.push('{');

      for (let key in payload) {
        this.serializeGroup(stream, key, payload[key]);
      }

      stream.push(',"jsonapi":{"version": "1.0"}');

      stream.push('}');
    } catch (err) {
      console.error(err);
    } finally {
      stream.push(null);
    }

    return stream;
  }

  serialize(payload) {
    const stream = new Readable({
      encoding: 'utf8'
    });

    this.serializePayload(payload, stream);

    return stream;
  }

  @bound
  serializeOne(item) {
    const data = {
      id: item.get('id'),
      type: pluralize(this.formatKey(this.nameFor(item))),
      attributes: this.attributesFor(item),
      relationships: {}
    };

    entries(this.relationshipsFor(item))
      .forEach(entry => {
        let [key, value] = entry;

        if (value) {
          key = this.formatKey(key);

          if (isArray(value)) {
            data.relationships[key] = {
              data: value.map(related => {
                return {
                  id: related.get('id'),
                  type: this.nameFor(related)
                };
              })
            };
          } else {
            data.relationships[key] = {
              data: {
                id: value.get('id'),
                type: this.nameFor(value)
              }
            };
          }
        }
      });

    return JSON.stringify(data);
  }
}

export default Serializer;
