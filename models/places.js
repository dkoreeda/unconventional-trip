const pgp = require('pg-promise')({});

const db = require('../db');

const Places = {};

Places.create = (place) => {
  return db.one(
    'INSERT INTO places(google_icon, google_place_id, name, rating, lat, lng, user_id, list_u_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [place.icon, place.place_id, place.name, place.rating, place.lat, place.lng, place.user_id, place.list_id]
    );
};

Places.findById = (id) => {
  return db.one(
    'SELECT * FROM places WHERE place_id = $1', [id]
    );
};

Places.findPlacesByListId = (id) => {
  return db.manyOrNone(
    'SELECT * FROM places WHERE list_u_id = $1', [id]
    );
};

Places.update = (id, user_id) => {
  // console.log(checked);
  console.log(id);
  console.log(user_id);
  return db.one(
    'UPDATE places SET checked = NOT checked, user_id = $1 WHERE place_id = $2 returning *', [user_id, id]
  );
};

Places.destroy = (id) => {
  return db.any('DELETE FROM places WHERE place_id = $1', [id]);
};

module.exports = Places;
