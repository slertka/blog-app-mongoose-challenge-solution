'use strict';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const expect = chai.expect;

const { BlogPost } = require('./models');
const { app, runServer, closeServer } = require('./server');
const { TEST_DATABASE_URL } = require('./config');

chai.use(chaiHttp);

// use faker to generate placeholder values for 'author', 'title', 'content', 'created'
// insert that data into mongo
function seedBlogPostData() {
  console.info('seeding blogpost data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateBlogPostData())
  };

  return Promise.insertMany(seedData);
};

function generateBlogPostData() {
  return {
    author: {
      firstName: faker.name.firstName,
      lastName: faker.name.lastName
    },
    title: faker.company.catchPhraseDescriptor,
    content: faker.lorem.paragraph,
    created: new Date.now()
  }
};

function tearDownDb() {

};