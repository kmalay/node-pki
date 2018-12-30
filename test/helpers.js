const request = require('supertest');
const chai = require('chai');
const app = require('../src/server');

global.app = app;
global.request = request(app);
global.expect = chai.expect;
