const User = require('../../../models/user');
const Comment = require('../../../models/comments');

const controller = {};

controller.new = (req, res) => {
  res.render('users/new');
}

controller.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

controller.signin = (req, res) => {
  res.render('users/login');
}

controller.index = (req, res) => {
  const id = req.params.id;
  console.log("index", id);
  console.log(typeof id);
  User
    .findUserById(id)
    .then ((data) => {
      console.log("data --> ",data);
      res.render(`users/index`, {data: data});
    })
    .catch(err => console.log('Error: ', err));
}

controller.show = (req, res) => {
  const id = req.params.id;
  console.log("controller show", id);
    User
        .findPlacesById(id)
        .then((data) => {
          console.log(data);
            res.render('users/show', {data: data});
        })
        .catch(err => console.log('ERROR:', err));
};

controller.profile = (req, res) => {
  const id = req.params.id;
  User
    .findUserById(id)
    .then(user => {
      res.render('users/profile', {user: user});
    })
    .catch(err => console.log('Error: ', err));
}

// controller.create = (req, res) => {
//   const body = req.body;
//   // console.log(body);
//   const user = body.userId;
//   const comment = body.comment;
//   const place = body.placeId;

//   const comments = {
//     user: user,
//     place: place,
//     comment: comment
//   };

//   Comment
//     .create(comments)
//     .then((data) => {
//       console.log(data);
//       res.json(data);
//       // res.render('users/show', {comments: comments});
//     })
//     .catch(err => console.log('Error: ', err));
// };

// controller.comments = (req, res) => {
//   const body = req.body;
//   console.log("controller.comments", body);
//   const user = body.userId;
//   const place = body.placeId;

//   const data = {
//     user: user,
//     place: place
//   }

//   Comment
//     .findByPlaceId(data)
//     .then((data) => {
//       console.log(data);
//       res.json(data);
//     })
//     .catch(err => console.log('Error: ', err));
// };

module.exports = controller;
