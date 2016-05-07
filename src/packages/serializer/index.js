import { Readable } from 'stream';

import {
  underscore,
  dasherize,
  pluralize,
  camelize
} from 'inflection';

import Base from '../base';

import tryCatch from '../../utils/try-catch';

import bound from '../../decorators/bound';

const { max } = Math;
const { keys } = Object;
const { isArray } = Array;

class Serializer extends Base {
  hasOne = [];

  hasMany = [];

  attributes = [];

  serializers = new Map();

  fieldsFor(name, fields = {}) {
    return fields[camelize(name.replace(/\-/g, '_'), true)];
  }

  attributesFor(item, fields) {
    let i, attr, attrs;

    attrs = {};

    if (!fields) {
      fields = this.attributes;
    }

    for (i = 0; i < fields.length; i++) {
      attr = fields[i];

      if (attr.indexOf('id') < 0) {
        attrs[this.formatKey(attr)] = item[attr];
      }
    }

    return attrs;
  }

  relationshipsFor(item, include, fields) {
    const { domain, hasOne, hasMany } = this;
    const hash = { data: {}, included: [] };
    let i, id, key, type, records, related, relatedSerializer;

    for (i = 0; i < hasOne.length; i++) {
      key = hasOne[i];
      related = item[key];

      if (related) {
        id = related.id;
        type = pluralize(related.getModelName());

        hash.data[key] = {
          data: {
            id,
            type
          },

          links: {
            self: `${domain}/${type}/${id}`
          }
        };

        if (include.indexOf(key) >= 0) {
          relatedSerializer = this.serializers.get(type);

          if (relatedSerializer) {
            hash.included.push(
              relatedSerializer.serializeOne(related, [], fields)
            );
          }
        }
      }
    }

    hash.data = {
      ...hash.data,

      ...hasMany.reduce((group, relatedKey) => {
        records = item[relatedKey];

        if (!records || !records.length) {
          return group;
        }

        return {
          ...group,

          [relatedKey]: {
            data: records.map(record => {
              id = record.id;

              if (!type) {
                type = pluralize(record.getModelName());
              }

              if (include.indexOf(relatedKey) >= 0) {
                if (!relatedSerializer) {
                  relatedSerializer = this.serializers.get(type);
                }

                if (relatedSerializer) {
                  hash.included.push(
                    relatedSerializer.serializeOne(record, [], fields)
                  );
                }
              }

              return {
                id,
                type,

                links: {
                  self: `${domain}/${type}/${id}`
                }
              };
            })
          }
        };
      }, {})
    };

    return hash;
  }

  formatKey(key) {
    return dasherize(underscore(key));
  }

  serializeGroup(stream, key, data, include, fields) {
    stream.push(`"${this.formatKey(key)}":`);

    if (key === 'data') {
      let included = [];
      let lastItemIndex;

      if (isArray(data)) {
        lastItemIndex = max(data.length - 1, 0);

        stream.push('[');

        for (let i = 0; i < data.length; i++) {
          let item = this.serializeOne(data[i], include, fields);

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
        data = this.serializeOne(data, include, fields, false);

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

        stream.push(',"included":[');

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

  async serializePayload(stream, payload, include, fields) {
    tryCatch(() => {
      let i, key, payloadKeys;

      stream.push('{');

      payloadKeys = keys(payload);

      for (i = 0; i < payloadKeys.length; i++) {
        key = payloadKeys[i];

        this.serializeGroup(stream, key, payload[key], include, fields);
        stream.push(',');
      }

      stream.push('"jsonapi":{"version":"1.0"}}');
    }, err => {
      console.error(err);
    });

    stream.push(null);

    return stream;
  }

  stream(payload, include, fields) {
    const stream = new Readable({
      encoding: 'utf8'
    });

    this.serializePayload(stream, payload, include, fields);

    return stream;
  }

  @bound
  serializeOne(item, include, fields, links = true) {
    const { id } = item;
    const name = item.getModelName();
    const type = pluralize(name);
    const data = {
      id,
      type,
      attributes: this.attributesFor(item, this.fieldsFor(name, fields))
    };

    const relationships = this.relationshipsFor(item, include, fields);

    if (keys(relationships.data).length) {
      data.relationships = relationships.data;
    }

    if (relationships.included.length) {
      data.included = relationships.included;
    }

    if (links) {
      data.links = {
        self: `${this.domain}/${type}/${id}`
      };
    }

    return data;
  }
}

export default Serializer;
