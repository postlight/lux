export default {
  server: {
    cors: {
      origin: '*',
      enabled: true,

      headers: [
        'Accept',
        'Content-Type'
      ],

      methods: [
        'GET',
        'POST',
        'PATCH',
        'DELETE',
        'HEAD',
        'OPTIONS'
      ]
    }
  },

  logging: {
    level: 'DEBUG',
    format: 'text',
    enabled: true,

    filter: {
      params: [
        'email',
        'password'
      ]
    }
  }
};
