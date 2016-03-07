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

const { max } = Math;
const { isArray } = Array;
const { keys, entries } = Object;

class Serializer extends Base {
  hasOne = [];

  hasMany = [];

  attributes = [];

  attributesFor(item) {
    let attrs = {};

    for (let attr of this.attributes) {
      attrs[this.formatKey(attr)] = item[attr];
    }

    return attrs;
  }

  relationshipsFor(item, include = []) {
    const hash = {
      data: {},
      included: []
    };

    for (let key of this.hasOne) {
      let related = item[key];

      if (related) {
        let relatedModelName = pluralize(related.getModelName());

        hash.data[key] = {
          data: {
            id: related.id,
            type: relatedModelName
          }
        };

        if (include.includes(key)) {
          let relatedSerializer = this.container.lookup(
            'serializer',
            relatedModelName
          );

          if (relatedSerializer) {
            hash.included.push(
              relatedSerializer.serializeOne(related)
            );
          }
        }
      }
    }

    for (let key of this.hasMany) {
      let records = item[key];

      if (records && records.length) {
        let relatedModelName, relatedSerializer;

        hash.data[key] = [];
        records = records.slice();

        for (let i = 0; i < records.length; i++) {
          let related = records[i];

          if (related) {
            if (!relatedModelName) {
              relatedModelName = pluralize(related.getModelName());
            }

            hash.data[key][i] = {
              id: related.id,
              type: relatedModelName
            };

            if (include.includes(key)) {
              if (!relatedSerializer) {
                relatedSerializer = this.container.lookup(
                  'serializer',
                  relatedModelName
                );
              }

              if (relatedSerializer) {
                hash.included.push(
                  relatedSerializer.serializeOne(related)
                );
              }
            }
          }
        }
      }
    }

    return hash;
  }

  formatKey(key) {
    return dasherize(underscore(key));
  }

  serializeGroup(stream, key, data, include) {
    stream.push(`"${this.formatKey(key)}":`);

    if (key === 'data') {
      let included = [];
      let lastItemIndex;

      if (isArray(data)) {
        lastItemIndex = max(data.length - 1, 0);

        stream.push('[');

        for (let i = 0; i < data.length; i++) {
          let item = this.serializeOne(data[i], include);

          if (item.included && item.included.length) {
            included = [...included, ...item.included];
            delete item.included;
          }

          stream.push(
            JSON.stringify(item)
          );

          if (i !== lastItemIndex) {
            stream.push(',');
          }
        }

        stream.push(']');
      } else {
        data = this.serializeOne(data, include);

        if (data.included && data.included.length) {
          included = [...included, ...data.included];
          delete data.included;
        }

        stream.push(
          JSON.stringify(data)
        );
      }

      if (included.length) {
        lastItemIndex = max(included.length - 1, 0);

        stream.push(`,"included":[`);

        for (let i = 0; i < included.length; i++) {
          stream.push(
            JSON.stringify(included[i])
          );

          if (i !== lastItemIndex) {
            stream.push(',');
          }
        }

        stream.push(']');
      }
    } else {
      stream.push(JSON.stringify(data));
    }
  }

  async serializePayload(payload, stream, include) {
    try {
      stream.push('{');

      for (let key in payload) {
        this.serializeGroup(stream, key, payload[key], include);
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

  serialize(payload, include) {
    const stream = new Readable({
      encoding: 'utf8'
    });

    this.serializePayload(payload, stream, include);

    return stream;
  }

  @bound
  serializeOne(item, include) {
    const data = {
      id: item.id,
      type: pluralize(item.getModelName()),
      attributes: this.attributesFor(item)
    };

    const relationships = this.relationshipsFor(item, include);

    if (keys(relationships.data).length) {
      data.relationships = relationships.data;
    }

    if (relationships.included.length) {
      data.included = relationships.included;
    }

    return data;
  }
}

export default Serializer;
