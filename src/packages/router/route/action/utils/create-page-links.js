/* @flow */

import omit from '../../../../../utils/omit';
import merge from '../../../../../utils/merge';
import createQueryString from '../../../../../utils/create-query-string';
import type { Params } from '../../../../request';
import type { Document } from '../../../../jsonapi';

type Links = $PropertyType<Document, 'links'>;
type Options = {
  total: number;
  params: Params;
  domain: string;
  pathname: void | string;
  defaultPerPage: number;
};

function createLinkTemplate(options: Options) {
  if (options.pathname) {
    const { total, params, domain, pathname, defaultPerPage } = options;
    const { page: { size = defaultPerPage } = {} } = params;
    const baseURL = `${domain}${pathname}`;
    const queryURL = `${baseURL}?`;
    const baseParams = omit(params, 'page');
    const lastPageNum = total > 0 ? Math.ceil(total / size) : 1;

    if (size && size !== defaultPerPage) {
      baseParams.page = { size };
    }

    const hasParams = Object.keys(baseParams).length;

    return pageNum => {
      let normalized: number;

      switch (pageNum) {
        case 'first':
          normalized = 1;
          break;

        case 'last':
          normalized = lastPageNum;
          break;

        default:
          normalized = pageNum;
      }

      if (normalized < 1 || normalized > lastPageNum) {
        return null;
      } else if (normalized > 1) {
        const paramsForPage = merge(baseParams, {
          page: {
            number: normalized
          }
        });

        return queryURL + createQueryString(paramsForPage);
      }

      return hasParams ? queryURL + createQueryString(baseParams) : baseURL;
    };
  }

  return () => null;
}

/**
 * @private
 */
export default function createPageLinks(options: Options): Links {
  const { params: { page: { number = 1 } = {} } } = options;
  const linkForPage = createLinkTemplate(options);

  return {
    self: linkForPage(number),
    first: linkForPage('first'),
    last: linkForPage('last'),
    prev: linkForPage(number - 1),
    next: linkForPage(number + 1),
  };
}
