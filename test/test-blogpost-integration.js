'use strict';

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');

const expect = chai.expect;

const { BlogPost } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// use faker to generate placeholder values for 'author', 'title', 'content', 'created'
// insert that data into mongo
function seedBlogPostData() {
  console.info('seeding blogpost data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateBlogPostData())
  };

  return BlogPost.insertMany(seedData);
};

function generateBlogPostData() {
  return {
    author: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    },
    title: faker.company.catchPhraseDescriptor(),
    content: faker.lorem.paragraph(),
    created: new Date
  }
};

function tearDownDb() {
  console.warn('deleting database');
  return mongoose.connection.dropDatabase();
};

describe('BlogPost API resource', function() {
  // create hooks; 'runServer', 'seedBlogPostData', and 'tearDownDb' must return Promises
  before(function() {
    return runServer(TEST_DATABASE_URL);
  })

  beforeEach(function() {
    return seedBlogPostData();
  })

  afterEach(function() {
    return tearDownDb();
  })

  after(function() {
    return closeServer();
  })

  // GET Request integration testing
  // Strategy
  //  1) seed data
  //  2) make GET request to API
  //  3) inspect response
  //  4) inspection database
  //  5) teardown database
    describe('GET ENDPOINT', function() {

      it('should return all existing blogposts', function() {
        let res;
        return chai.request(app)
          .get('/posts')
          .then(function(_res) {
            res = _res;
            expect(res).to.have.status(200);
            expect(res.body).to.have.lengthOf.at.least(1);
            return BlogPost.countDocuments();
          })
          .then(function(count) {
            expect(res.body).to.have.lengthOf(count);
          })
          .catch(function(err) {
            console.error(err);
          })
      })

      it('should return all the correct fields', function() {
        let resPost;
        return chai.request(app)
          .get('/posts')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.lengthOf.at.least(1);

            res.body.forEach(function(post) {
              expect(post).to.be.a('object');
              expect(post).to.include.keys('id', 'author', 'content', 'title', 'created');
            })
            resPost = res.body[0];
            return BlogPost.findById(resPost.id);
          })
          .then(function(post) {
            expect(resPost.id).to.equal(post.id);
            expect(resPost.author).to.equal(`${post.author.firstName} ${post.author.lastName}`);
            expect(resPost.content).to.equal(post.content);
            expect(resPost.title).to.equal(post.title);
            expect(resPost.created);
          })
      })
    })
})

