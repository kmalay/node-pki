const request = require('supertest');
const chai = require('chai');
const app = require('../index.js');

global.app = app;
global.request = request(app);
global.expect = chai.expect;
