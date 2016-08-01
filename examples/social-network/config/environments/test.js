export default {
  logging: {
    level: 'WARN',
    format: 'text',
    enabled: false,

    filter: {
      params: [
        'email',
        'password'
      ]
    }
  }
};
