// @flow
import omit from '../../../utils/omit';
import createQueryString from '../../../utils/create-query-string';

export default function createPageLinks({
  page,
  total,
  query,
  domain,
  pathname,
  defaultPerPage
}: {
  total: number;
  query: Object;
  domain: string;
  pathname: string;
  defaultPerPage: number;

  page: {
    size: number;
    number: number;
  };
}): {
  first: string,
  last: string,
  prev: ?string,
  next: ?string
} {
  const params = omit(query, 'page', 'page[size]', 'page[number]');
  const lastPageNum = total > 0 ? Math.ceil(total / page.size) : 1;
  let base = domain + pathname;
  let prev = null;
  let next = null;
  let last = null;
  let first = null;

  params.page = page.size !== defaultPerPage ? {
    size: page.size
  } : {};

  if (Object.keys(params).length > 1) {
    base += '?';
    first = base + createQueryString(params);
  } else {
    first = base;
    base += '?';
  }

  if (lastPageNum > 1) {
    last = base + createQueryString({
      ...params,

      page: {
        ...params.page,
        number: lastPageNum
      }
    });
  } else {
    last = first;
  }

  if (page.number > 1) {
    if (page.number === 2) {
      prev = first;
    } else {
      prev = base + createQueryString({
        ...params,

        page: {
          ...params.page,
          number: page.number - 1
        }
      });
    }
  }

  if (page.number < lastPageNum) {
    next = base + createQueryString({
      ...params,

      page: {
        ...params.page,
        number: page.number + 1
      }
    });
  }

  return {
    first,
    last,
    prev,
    next
  };
}
