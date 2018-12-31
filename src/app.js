// Load environment variables first
require('dotenv').config({silent: true});

// Main starting point of the application
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const router = require('./router');

const app = express();

app.use(cors());
app.use(passport.initialize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

router(app);

module.exports = app;
