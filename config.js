'use strict';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/blog-app';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/blog-app';
exports.PORT = process.env.PORT || 8080;