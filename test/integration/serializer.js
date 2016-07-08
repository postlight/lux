import { expect } from 'chai';
import fetch from 'isomorphic-fetch';

const host = 'http://localhost:4000';

describe('Integration: class Serializer', () => {
  let subject;

  before(async () => {
    subject = await (await fetch(`${host}/posts/1?include=author`)).json();
  });

  it('serializes type', () => {
    const { data: { type } } = subject;

    expect(type).to.equal('posts');
  });

  it('serializes id', () => {
    const { data: { id } } = subject;

    expect(id).to.equal('1');
  });

  it('serializes attributes', () => {
    const { data: { attributes } } = subject;

    expect(attributes).to.have.all.keys(
      'title',
      'body',
      'created-at',
      'updated-at'
    );
  });

  it('serializes relationships', () => {
    const { data: { relationships } } = subject;

    expect(relationships)
      .to.have.property('author')
      .and.to.have.all.keys('data', 'links');

    expect(relationships.author.data).to.have.all.keys('type', 'id');
    expect(relationships.author.links).to.have.all.keys('self');
  });

  it('serializes included resources', () => {
    const { included: [author] } = subject;

    expect(author).to.have.all.keys('id', 'type', 'attributes', 'links');
    expect(author.links).to.have.all.keys('self');
    expect(author.attributes).to.have.all.keys('name', 'created-at');

    expect(author.type).to.equal('authors');
  });

  it('includes JSON API version', () => {
    const { jsonapi: { version } } = subject;

    expect(version).to.equal('1.0');
  });
});
