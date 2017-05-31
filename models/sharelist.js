const pgp = require('pg-promise')({});

const db = require('../db');

const SharedList = {};

SharedList.create = (id, name) => {
  return db.one(
    'INSERT INTO sharelists(sharedlist_name, list_u_id) VALUES ($1, $2) RETURNING *', [name, id]
    );
};

SharedList.findAll = () => {
  return db.any(
    'SELECT * FROM sharelists'
    );
}

SharedList.search = (keyword) => {
  return db.any(
    `SELECT * FROM sharelists WHERE sharelists.list_name LIKE '%${keyword}%';`
  );
}

module.exports = SharedList;
