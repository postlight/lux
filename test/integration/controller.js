import { expect } from 'chai';

import fetch from '../utils/fetch';

const host = 'http://localhost:4000';

describe('Integration: class Controller', () => {
  let createdId;

  describe('#index()', () => {
    let subject, payload;

    before(async () => {
      subject = await fetch(`${host}/posts`);
      payload = await subject.json();
    });

    it('has 200 status code', () => {
      expect(subject.status).to.equal(200);
    });

    it('has JSON API `Content-Type` header', () => {
      expect(
        subject.headers.get('Content-Type')
      ).to.equal('application/vnd.api+json');
    });

    it('returns a list of JSON API resource objects', () => {
      let item;

      expect(payload.data).to.be.an.instanceOf(Array);

      for (item of payload.data) {
        expect(item).to.have.all.keys(
          'type',
          'id',
          'links',
          'attributes',
          'relationships'
        );
      }
    });

    it('has a links with a reference to `self`', () => {
      expect(payload.links)
        .to.have.property('self')
        .and.equal(`${host}/posts`);
    });

    describe('pagination', () => {
      let pagesWithLimit, pagesWithoutLimit;

      before(async () => {
        pagesWithLimit = await Promise.all([
          ...[1, 2, 4, 5, 6].map(async (page) => {
            page = await fetch(
              `${host}/posts?page%5Bsize%5D=10&page%5Bnumber%5D=${page}`
            );

            return {
              subject: page,
              payload: await page.json()
            };
          })
        ]);

        pagesWithoutLimit = await Promise.all([
          ...[1, 2, 3].map(async (page) => {
            page = await fetch(`${host}/posts?page%5Bnumber%5D=${page}`);

            return {
              subject: page,
              payload: await page.json()
            };
          })
        ]);
      });

      it('has 200 status code', () => {
        expect(
          [...pagesWithLimit, ...pagesWithoutLimit].some(page => {
            return page.subject.status !== 200;
          })
        ).to.be.false;
      });

      it('supports page[size] parameter', () => {
        let page;

        for (page of pagesWithLimit) {
          expect(page.payload.data).to.have.length.within(0, 10);
        }
      });

      it('has a default page[size] of 25', () => {
        let page;

        for (page of pagesWithoutLimit) {
          expect(page.payload.data).to.have.length.within(0, 25);
        }
      });

      it('has [self, first, last, prev, next] links', () => {
        let page;

        for (page of pagesWithLimit) {
          expect(page.payload.links)
            .to.have.all.keys('self', 'first', 'last', 'prev', 'next');
        }

        for (page of pagesWithoutLimit) {
          expect(page.payload.links)
            .to.have.all.keys('self', 'first', 'last', 'prev', 'next');
        }
      });
    });

    describe('sorting', () => {
      let asc, desc;

      before(async () => {
        [asc, desc] = await Promise.all([
          ...[
            fetch(`${host}/posts?sort=title`),
            fetch(`${host}/posts?sort=-title`)
          ].map(async (req) => {
            const res = await req;

            return {
              subject: res,
              payload: await res.json()
            };
          })
        ]);
      });

      it('has 200 status code', () => {
        expect(asc.subject.status).to.equal(200);
        expect(desc.subject.status).to.equal(200);
      });

      it('can sort in ASCENDING order', () => {
        const { payload: { data: [{ attributes: { title } }] } } = asc;

        expect(title).to.equal('New Post 1');
      });

      it('can sort in DESCENDING order', () => {
        const { payload: { data: [{ attributes: { title } }] } } = desc;

        expect(title).to.equal('New Post 9');
      });
    });

    describe('filtering', () => {
      let filtered;

      before(async () => {
        const res = await fetch(`${host}/posts?${encodeURIComponent('filter[title]')}=${encodeURIComponent('New Post 1')}`);

        filtered = {
          subject: res,
          payload: await res.json()
        };
      });

      it('has 200 status code', () => {
        expect(filtered.subject.status).to.equal(200);
      });

      it('works as expected', () => {
        const {
          payload: {
            data: [{ attributes: { title } }]
          }
        } = filtered;

        expect(filtered.payload.data).to.have.length(1);
        expect(title).to.equal('New Post 1');
      });
    });

    describe('including related resources', () => {
      let included;

      before(async () => {
        const req = await fetch(`${host}/posts?include=author`);

        included = {
          subject: req,
          payload: await req.json()
        };
      });

      it('has 200 status code', () => {
        expect(included.subject.status).to.equal(200);
      });

      it('works as expected', () => {
        let item;

        expect(included.payload.included).to.be.an.instanceOf(Array);

        for (item of included.payload.included) {
          expect(item).to.have.all.keys(
            'type',
            'id',
            'links',
            'attributes'
          );

          expect(item.type).to.equal('authors');
        }
      });
    });

    describe('sparse fieldsets', () => {
      let included, excluded;

      before(async () => {
        [included, excluded] = await Promise.all([
          ...[
            fetch(`${host}/posts?include=author&${encodeURIComponent('fields[posts]')}=title&${encodeURIComponent('fields[authors]')}=name`),
            fetch(`${host}/posts?${encodeURIComponent('fields[posts]')}=title`)
          ].map(async (req) => {
            const res = await req;

            return {
              subject: res,
              payload: await res.json()
            };
          })
        ]);
      });

      it('has 200 status code', () => {
        expect(included.subject.status).to.equal(200);
        expect(excluded.subject.status).to.equal(200);
      });

      it('works with main resource', () => {
        let item;

        for (item of excluded.payload.data) {
          expect(item.attributes).to.have.all.keys('title');
        }
      });

      it('works with included resources', () => {
        let item;

        for (item of included.payload.data) {
          expect(item.attributes).to.have.all.keys('title');
        }

        for (item of included.payload.included) {
          expect(item.type).to.equal('authors');
          expect(item.attributes).to.have.all.keys('name');
        }
      });
    });
  });

  describe('#show()', () => {
    let subject, payload;

    before(async () => {
      subject = await fetch(`${host}/posts/1`);
      payload = await subject.json();
    });

    it('has 200 status code', () => {
      expect(subject.status).to.equal(200);
    });

    it('has JSON API `Content-Type` header', () => {
      expect(
        subject.headers.get('Content-Type')
      ).to.equal('application/vnd.api+json');
    });

    it('returns a JSON API resource object', () => {
      expect(payload.data).to.have.all.keys(
        'type',
        'id',
        'attributes',
        'relationships'
      );
    });

    describe('including related resources', () => {
      let included;

      before(async () => {
        const req = await fetch(`${host}/posts/1?include=author`);

        included = {
          subject: req,
          payload: await req.json()
        };
      });

      it('has 200 status code', () => {
        expect(included.subject.status).to.equal(200);
      });

      it('works as expected', () => {
        let item;

        expect(included.payload.included).to.be.an.instanceOf(Array);

        for (item of included.payload.included) {
          expect(item).to.have.all.keys(
            'type',
            'id',
            'links',
            'attributes'
          );

          expect(item.type).to.equal('authors');
        }
      });
    });

    describe('sparse fieldsets', () => {
      let included, excluded;

      before(async () => {
        [included, excluded] = await Promise.all([
          ...[
            fetch(`${host}/posts/1?include=author&${encodeURIComponent('fields[posts]')}=title&${encodeURIComponent('fields[authors]')}=name`),
            fetch(`${host}/posts/1?${encodeURIComponent('fields[posts]')}=title`)
          ].map(async (req) => {
            const res = await req;

            return {
              subject: res,
              payload: await res.json()
            };
          })
        ]);
      });

      it('has 200 status code', () => {
        expect(included.subject.status).to.equal(200);
        expect(excluded.subject.status).to.equal(200);
      });

      it('works with main resource', () => {
        expect(excluded.payload.data.attributes).to.have.all.keys('title');
      });

      it('works with included resources', () => {
        let item;

        expect(included.payload.data.attributes).to.have.all.keys('title');

        for (item of included.payload.included) {
          expect(item.type).to.equal('authors');
          expect(item.attributes).to.have.all.keys('name');
        }
      });
    });
  });

  describe('#create()', () => {
    let subject
    let payload;

    before(async () => {
      subject = await fetch(`${host}/posts`, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'posts',
            attributes: {
              title: 'Not another Node.js framework…',
              body: 'A few years ago I was working for a very lean web start up...',
              'is-public': false
            }
          }
        })
      });

      payload = await subject.json();
      createdId = payload.data.id;
    });

    it('has 201 status code', () => {
      expect(subject.status).to.equal(201);
    });

    it('has JSON API `Content-Type` header', () => {
      expect(
        subject.headers.get('Content-Type')
      ).to.equal('application/vnd.api+json');
    });

    it('returns a JSON API resource object', () => {
      expect(payload.data).to.have.all.keys(
        'type',
        'id',
        'attributes',
        'relationships'
      );
    });
  });

  describe('#update()', () => {
    let subject, payload;

    before(async () => {
      subject = await fetch(`${host}/posts/${createdId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            id: `${createdId}`,
            type: 'posts',
            attributes: {
              'is-public': true
            }
          }
        })
      });

      payload = await subject.json();
    });

    it('has 200 status code', () => {
      expect(subject.status).to.equal(200);
    });

    it('has JSON API `Content-Type` header', () => {
      expect(
        subject.headers.get('Content-Type')
      ).to.equal('application/vnd.api+json');
    });

    it('returns a JSON API resource object', () => {
      expect(payload.data).to.have.all.keys(
        'type',
        'id',
        'attributes',
        'relationships'
      );
    });
  });

  describe('#destroy()', () => {
    let subject;

    before(async () => {
      subject = await fetch(`${host}/posts/${createdId}`, {
        method: 'DELETE'
      });
    });

    it('has 204 status code', () => {
      expect(subject.status).to.equal(204);
    });
  });

  describe('#preflight()', () => {
    let subject;

    before(async () => {
      subject = await fetch(`${host}/posts`, {
        method: 'OPTIONS'
      });
    });

    it('has 204 status code', () => {
      expect(subject.status).to.equal(204);
    });
  });

  describe('Regression: #middleware (https://github.com/postlight/lux/issues/94)', () => {
    let subject;

    before(async () => {
      subject = await fetch(`${host}/posts`);
    });

    it('includes middleware from it\'s `parentController`', () => {
      expect(
        subject.headers.get('X-Powered-By')
      ).to.equal('Lux');
    });

    it('includes middleware defined in `beforeAction`', () => {
      expect(
        subject.headers.get('X-Controller')
      ).to.equal('Posts');
    });
  });

  describe('Regression: #createPageLinks (https://github.com/postlight/lux/issues/102)', () => {
    let url, subject, payload;

    before(async () => {
      url = `${host}/tags`;
      subject = await fetch(url);
      payload = await subject.json();
    });

    it('has the expected `links` value', () => {
      expect(payload.links).to.deep.equal({
        self: url,
        first: url,
        last: url,
        prev: null,
        next: null
      });
    });
  });

  /**
   * This is a VERY basic test to show that namespaces are working.
   *
   * TODO: Add more meaningful namespace tests as a part of
   *       https://github.com/postlight/lux/pull/287.
   */
  describe('Namespaces', () => {
    it('works as expected', async () => {
      const subject = await fetch(`${host}/admin/posts`);

      expect(subject.headers.get('X-Namespace')).to.equal('admin');
    });
  });
});
