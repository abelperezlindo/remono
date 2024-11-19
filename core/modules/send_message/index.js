const client = require('./client');
const admin = require('./admin');

module.exports = {
  name: 'Send Message',
  description: 'Send a message to the server',
  version: 'Alpha1',
  type: 'io',
  default: {
    in: 1000
  },
  client,
  admin
};