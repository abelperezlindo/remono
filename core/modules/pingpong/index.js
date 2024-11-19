const client = require('./client');
const admin = require('./admin');

module.exports = {
  name: 'PingPong',
  description: 'Send a ping and receive a pong',
  version: 'Alpha1',
  type: 'io',
  default: {
    in: 1000
  },
  client,
  admin
};