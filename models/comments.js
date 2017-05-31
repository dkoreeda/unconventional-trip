const db = require('../db');

const Comment = {};

Comment.create = (data) => {
  console.log("comment.create", data);
  return db.one(
    'INSERT INTO comments(comment, user_id, place_user_id) VALUES ($1, $2, $3) RETURNING *', [data.comment, data.user, data.place]
    );
};

Comment.findByPlaceId = (data) => {
  console.log("comment.findByPlaceId", data);
  return db.manyOrNone(
    'SELECT * FROM places JOIN comments ON places.place_id = comments.place_user_id WHERE places.place_id = $1', [data.place]
    )
}

module.exports = Comment;
