// @flow
import { singularize } from 'inflection';

import omit from '../../../utils/omit';

import type { IncomingMessage } from 'http';
import typeof { Model } from '../../database';

/**
 * @private
 */
export default function setInclude(req: IncomingMessage): void {
  const { route } = req;

  if (route && /^(index|show)$/g.test(route.action)) {
    const {
      model,
      modelName,
      relationships
    }: {
      model: Model,
      modelName: string,
      relationships: Array<string>
    } = this;

    const {
      params: {
        include = []
      }
    } = req;

    let {
      params: {
        fields
      }
    } = req;

    fields = omit(fields, modelName);

    Object.assign(req.params, {
      include: relationships.reduce((included, value) => {
        const relationship = model.relationshipFor(value);

        if (!relationship) {
          return included;
        }

        if (include.indexOf(value) >= 0) {
          const {
            model: {
              serializer: {
                attributes: relatedAttrs
              }
            }
          } = relationship;

          let fieldsForRelationship = fields[singularize(value)];

          if (fieldsForRelationship) {
            fieldsForRelationship = fieldsForRelationship.filter(attr => {
              return relatedAttrs.indexOf(attr) >= 0;
            });
          } else {
            fieldsForRelationship = relatedAttrs;
          }

          included[value] = [
            'id',
            ...fieldsForRelationship
          ];
        } else {
          included[value] = ['id'];
        }

        return included;
      }, {})
    });
  }
}
