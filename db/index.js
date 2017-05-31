const pgp = require('pg-promise')();

// var db = pgp(
//   process.env.DATABASE_URL
//   ||
//   'postgres://deisekoreeda@localhost:5432/users_places_test1');

var db = pgp(process.env.DATABASE_URL || 'postgres://deisekoreeda@localhost:5432/users_places_test1');

module.exports = db;

