// @flow
import omit from '../../../../../utils/omit';
import merge from '../../../../../utils/merge';
import createQueryString from '../../../../../utils/create-query-string';
import type { Request$params } from '../../../../server';
import type { JSONAPI$DocumentLinks } from '../../../../jsonapi';

function createLinkTemplate({
  total,
  params,
  domain,
  pathname,
  defaultPerPage
}: {
  total: number,
  params: Request$params;
  domain: string;
  pathname: string;
  defaultPerPage: number;
}) {
  const { page: { size = defaultPerPage } = {} } = params;
  const baseURL = `${domain}${pathname}`;
  const queryURL = `${baseURL}?`;
  const baseParams = omit(params, 'page');
  const lastPageNum = total > 0 ? Math.ceil(total / size) : 1;

  if (size && size !== defaultPerPage) {
    baseParams.page = { size };
  }

  const hasParams = Object.keys(baseParams).length;

  return function linkTemplate(pageNum: number | 'first' | 'last'): ?string {
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

/**
 * @private
 */
export default function createPageLinks(opts: {
  total: number;
  params: Request$params;
  domain: string;
  pathname: string;
  defaultPerPage: number;
}): JSONAPI$DocumentLinks {
  const { page: { number = 1 } = {} } = opts.params;
  const linkForPage = createLinkTemplate(opts);

  return {
    self: linkForPage(number),
    first: linkForPage('first'),
    last: linkForPage('last'),
    prev: linkForPage(number - 1),
    next: linkForPage(number + 1)
  };
}
