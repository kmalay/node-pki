// Load environment variables first
require('dotenv').config({silent: true});

// Main starting point of the application
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const router = require('./router');

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(passport.initialize());

router(app);

module.exports = app;
