// @flow
import { VERSION as JSONAPI_VERSION } from '../../../jsonapi';

export const FORMAT_RESULT_MEMBER = {
  data: {
    id: '1',
    type: 'posts',
    attributes: {
      body: 'Test...',
      'created-at': '2016-08-10T22:18:43.593Z',
      title: 'New Post 1',
      'updated-at': '2016-08-10T22:18:43.593Z'
    },
    relationships: {
      author: {
        data: {
          id: '1',
          type: 'authors'
        },
        links: {
          self: 'http://localhost:4000/authors/1'
        }
      }
    }
  },
  links: {
    self: 'http://localhost:4000/posts/1'
  },
  jsonapi: {
    version: JSONAPI_VERSION
  }
};

export const FORMAT_RESULT_COLLECTION = {
  data: [
    {
      id: '1',
      type: 'posts',
      attributes: {
        body: 'Test...',
        'created-at': '2016-08-10T22:18:43.593Z',
        title: 'New Post 1',
        'updated-at': '2016-08-10T22:18:43.593Z',
      },
      relationships: {
        author: {
          data: {
            id: '1',
            type: 'authors'
          },
          links: {
            self: 'http://localhost:4000/authors/1'
          }
        }
      },
      links: {
        self: 'http://localhost:4000/posts/1'
      }
    },
    {
      id: '2',
      type: 'posts',
      attributes: {
        body: 'Test...',
        'created-at': '2016-08-10T22:18:43.593Z',
        title: 'New Post 2',
        'updated-at': '2016-08-10T22:18:43.593Z',
      },
      relationships: {
        author: {
          data: {
            id: '1',
            type: 'authors'
          },
          links: {
            self: 'http://localhost:4000/authors/1'
          }
        }
      },
      links: {
        self: 'http://localhost:4000/posts/2'
      }
    },
    {
      id: '3',
      type: 'posts',
      attributes: {
        body: 'Test...',
        'created-at': '2016-08-10T22:18:43.593Z',
        title: 'New Post 3',
        'updated-at': '2016-08-10T22:18:43.593Z'
      },
      relationships: {
        author: null
      },
      links: {
        self: 'http://localhost:4000/posts/3'
      }
    },
    {
      id: '4',
      type: 'posts',
      attributes: {
        body: 'Test...',
        'created-at': '2016-08-10T22:18:43.593Z',
        title: 'New Post 4',
        'updated-at': '2016-08-10T22:18:43.593Z'
      },
      relationships: {
        author: {
          data: {
            id: '2',
            type: 'authors'
          },
          links: {
            self: 'http://localhost:4000/authors/2'
          }
        }
      },
      links: {
        self: 'http://localhost:4000/posts/4'
      }
    },
    {
      id: '5',
      type: 'posts',
      attributes: {
        body: 'Test...',
        'created-at': '2016-08-10T22:18:43.593Z',
        title: 'New Post 5',
        'updated-at': '2016-08-10T22:18:43.593Z'
      },
      relationships: {
        author: {
          data: {
            id: '2',
            type: 'authors'
          },
          links: {
            self: 'http://localhost:4000/authors/2'
          }
        }
      },
      links: {
        self: 'http://localhost:4000/posts/5'
      }
    }
  ],
  links: {
    self: 'http://localhost:4000/posts'
  },
  jsonapi: {
    version: JSONAPI_VERSION
  }
};

export const FORMAT_RESULT_MEMBER_INCLUDED = {
  ...FORMAT_RESULT_MEMBER,
  included: [
    {
      id: '1',
      type: 'authors',
      attributes: {
        name: 'New Author 1',
        'created-at': '2016-08-10T22:18:43.593Z'
      },
      links: {
        self: 'http://localhost:4000/authors/1'
      }
    }
  ]
};

export const FORMAT_RESULT_COLLECTION_INCLUDED = {
  ...FORMAT_RESULT_COLLECTION,
  included: [
    {
      id: '1',
      type: 'authors',
      attributes: {
        name: 'New Author 1',
        'created-at': '2016-08-10T22:18:43.593Z'
      },
      links: {
        self: 'http://localhost:4000/authors/1'
      }
    },
    {
      id: '2',
      type: 'authors',
      attributes: {
        name: 'New Author 2',
        'created-at': '2016-08-10T22:18:43.593Z'
      },
      links: {
        self: 'http://localhost:4000/authors/2'
      }
    }
  ]
};

export const FORMAT_ONE_RESULT = {
  ...FORMAT_RESULT_MEMBER.data
};

export const FORMAT_RELATIONSHIP_RESULT = {
  data: {
    id: '1',
    type: 'authors'
  },
  links: {
    self: 'http://localhost:4000/authors/1'
  }
};
