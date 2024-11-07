const client = require('./client');
const admin = require('./admin');

module.exports = {
  name: 'pingpong',
  description: 'Ping Pong',
  version: 'Alpha1',
  type: 'io',
  default: {
    in: 1000
  },
  client,
  admin
};