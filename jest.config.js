const request = require('supertest');
const app = require('./src/server');

module.exports = {
  verbose: true,
  globals: {
    "app": app,
    "request": request(app)
  },
  globalSetup: './src/components/testHelpers/globalSetup.js',
  globalTeardown: './src/components/testHelpers/globalTeardown.js'
}
