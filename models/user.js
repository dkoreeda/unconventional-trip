// const pgp = require('pg-promise')({});
const bcrypt = require('bcrypt');
const db = require('../db');
// const fetch = require('node-fetch');

const User = {};

User.findUserById = (id) => {
  console.log("models", id);
  return db.one('SELECT * FROM users WHERE users.id = $1', [id]);
};

// Users.create = (username) => {
//   return db.one(
//     'INSERT INTO users(username) VALUES ($1) RETURNING *', [username]
//     );
// };

User.findPlacesById = (id) => {
  return db.any('SELECT * FROM places JOIN users ON places.user_id = users.id WHERE users.id = $1', [id]
  );
};

// Users.findUsersById = (id) => {
//   return db.any('SELECT * FROM places WHERE user_id = $1', [id]);
// };

User.create = (user) => {
  // console.log("models", user);
  const password = bcrypt.hashSync(user.password, 10);
  return db.oneOrNone(`INSERT INTO users(email, password_digest) VALUES ($1, $2) RETURNING *;`, [ user.email, password ]);
};

User.findByEmail = (email) => {
  return db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, [email]);
};

module.exports = User;

