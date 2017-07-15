/* @flow */

import noop from '@lux/utils/noop'
import Logger from '@lux/packages/logger'
import { request, response } from '../../../../adapter/mock'
import { createAction, createPageLinks } from '../index'
import { getTestApp } from '../../../../../../test/utils/test-app'
import type Controller from '@lux/packages/controller'
import type { Action } from '../index'

const DOMAIN = 'http://localhost:4000'
const RESOURCE = 'posts'

const logger = new Logger({
  level: 'ERROR',
  format: 'text',
  filter: {
    params: [],
  },
  enabled: false,
})

describe('module "router/route/action"', () => {
  describe('#createAction()', () => {
    let app
    let result

    beforeAll(async () => {
      app = await getTestApp()

      // $FlowFixMe
      const controller: Controller = app.controllers.get('health')
      const action: Action<any> = controller.index

      result = createAction('custom', action, controller)
    })

    afterAll(async () => {
      await app.destroy()
    })

    test('returns an array of functions', () => {
      expect(result).toEqual(expect.any(Array))
      expect(result).toHaveLength(1)
    })

    test('resolves with the expected value', async () => {
      const fn = result.slice().pop()
      const data = await fn(
        request.create({
          logger,
          url: '/health',
          method: 'GET',
          params: {},
          headers: new Map(),
          encrypted: false,
          defaultParams: {},
        }),
        response.create({
          logger,
          resolve: noop,
        }),
      )

      expect(data).toBe(204)
    })
  })

  describe('#createPageLinks()', () => {
    const getOptions = (
      {
        total = 100,
        params = {},
      }: {
        total?: number,
        params?: Object,
      } = {},
    ) => ({
      total,
      params,
      domain: DOMAIN,
      pathname: `/${RESOURCE}`,
      defaultPerPage: 25,
    })

    test('works with vanilla params', () => {
      const base = `${DOMAIN}/${RESOURCE}`
      ;[1, 2, 3, 4].forEach(number => {
        const opts = getOptions({
          params: {
            page: {
              number,
            },
          },
        })

        let target = {
          self: `${base}?page%5Bnumber%5D=${number}`,
          first: base,
          last: `${base}?page%5Bnumber%5D=4`,
          prev: `${base}?page%5Bnumber%5D=${number - 1}`,
          next: `${base}?page%5Bnumber%5D=${number + 1}`,
        }

        // eslint-disable-next-line default-case
        switch (number) {
          case 1:
            target = {
              ...target,
              self: target.first,
              prev: null,
            }
            break

          case 2:
            target = {
              ...target,
              prev: target.first,
            }
            break

          case 4:
            target = {
              ...target,
              next: null,
            }
            break
        }

        expect(createPageLinks(opts)).toEqual(target)
      })
    })

    test('works with a custom size', () => {
      const size = 10
      const base = `${DOMAIN}/${RESOURCE}?page%5Bsize%5D=${size}`
      ;[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(number => {
        const opts = getOptions({
          params: {
            page: {
              size,
              number,
            },
          },
        })

        let target = {
          self: `${base}&page%5Bnumber%5D=${number}`,
          first: base,
          last: `${base}&page%5Bnumber%5D=10`,
          prev: `${base}&page%5Bnumber%5D=${number - 1}`,
          next: `${base}&page%5Bnumber%5D=${number + 1}`,
        }

        // eslint-disable-next-line default-case
        switch (number) {
          case 1:
            target = {
              ...target,
              self: target.first,
              prev: null,
            }
            break

          case 2:
            target = {
              ...target,
              prev: target.first,
            }
            break

          case 10:
            target = {
              ...target,
              next: null,
            }
            break
        }

        expect(createPageLinks(opts)).toEqual(target)
      })
    })

    test('works with complex parameter sets', () => {
      const iters = [1, 2, 3, 4]
      const base =
        `${DOMAIN}/${RESOURCE}?sort=-created-at&include=user` +
        '&fields%5Bposts%5D=title&fields%5Busers%5D=name'
      iters.forEach(number => {
        const opts = getOptions({
          params: {
            sort: '-created-at',
            include: ['user'],
            fields: {
              posts: ['title'],
              users: ['name'],
            },
            page: {
              number,
            },
          },
        })

        let target = {
          self: `${base}&page%5Bnumber%5D=${number}`,
          first: base,
          last: `${base}&page%5Bnumber%5D=4`,
          prev: `${base}&page%5Bnumber%5D=${number - 1}`,
          next: `${base}&page%5Bnumber%5D=${number + 1}`,
        }

        // eslint-disable-next-line default-case
        switch (number) {
          case 1:
            target = {
              ...target,
              self: target.first,
              prev: null,
            }
            break

          case 2:
            target = {
              ...target,
              prev: target.first,
            }
            break

          case 4:
            target = {
              ...target,
              next: null,
            }
            break
        }

        expect(createPageLinks(opts)).toEqual(target)
      })
    })

    test('works when the total is 0', () => {
      const options = getOptions({
        total: 0,
      })

      expect(createPageLinks(options)).toMatchSnapshot()
    })

    test('works when the maximum page is exceeded', () => {
      const options = getOptions({
        params: {
          page: {
            number: 1000,
          },
        },
      })

      expect(createPageLinks(options)).toMatchSnapshot()
    })
  })
})
