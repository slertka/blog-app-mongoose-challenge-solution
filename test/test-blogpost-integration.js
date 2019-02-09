'use strict';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const expect = chai.expect;

const { BlogPost } = require('./models');
const { app, runServer, closeServer } = require('./server');
const { TEST_DATABASE_URL } = require('./config');