export default {
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
