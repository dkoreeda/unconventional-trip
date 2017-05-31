const db = require('../db');

const List = {};

List.create = (data) => {
  return db.one(
    'INSERT INTO lists(list_name, user_id) VALUES ($1, $2) RETURNING *', [data.list, data.user]
    );
}

List.findAll = (id) => {
  return db.any(
    'SELECT * FROM lists WHERE user_id = $1', [id]
    );
}

List.findById = (id) => {
  return db.one(
    'SELECT * FROM lists WHERE list_id = $1', [id]
    );
}

List.findPlacesByUserId = (id) => {
  return db.any(
    // select * from lists join places on places.list_u_id = lists.list_id where lists.user_id = 14;
    'SELECT * FROM lists JOIN places ON places.list_u_id = lists.list_id WHERE lists.list_id = $1', [id]
    );
}

List.update = (id, name) => {
  return db.one(
    'UPDATE lists SET list_name = $1 WHERE list_id = $2 returning *', [name, id]
  );
};

List.destroy = (id) => {
  return db.any('DELETE FROM lists WHERE list_id = $1', [id]);
};

module.exports = List;
