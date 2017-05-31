const List = require('../../../models/lists');
const SharedList = require('../../../models/sharelist');

const controller = {};

controller.index = (req, res) => {
  const id = req.params.id;
  List
    .findAll(id)
    .then((data) => {
      console.log(data);
      res.render('lists/index', {data: data});
    })
    .catch(err => console.log('Error: ', err));
}

controller.show = (req, res) => {
  const listId = req.params.list_id;
  List
    .findPlacesByUserId(listId)
    .then((data) => {
      console.log(data);
      res.render('lists/show', {data: data});
    })
    .catch(err => console.log('Error: ', err));
}

controller.fetchLists = (req, res) => {
  const id = req.body.userId;
  console.log("fetch lists --------> ", id);
  List
    .findAll(id)
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log('Error: ', err));
}

controller.create = (req, res) => {
  const body = req.body;
  console.log(body);
  const list = body.list;
  const user = body.user;

  const save = {
    list: list,
    user: user
  };

  List
    .create(save)
    .then((data) => {
      console.log(data);
      res.json(data);
      // res.render('users/profile', {data: data})
    })
    .catch(err => console.log('Error: ', err));
}

controller.update = (req, res) => {
  // console.log(req.params);
  const id = req.params.list_id;
  const rename = req.body.name;
        // checked = req.body.checked,
        // user_id = req.body.user_id;

  List
    .update(id, rename)
    .then ((data) => {
      res.json(data);
    })
    .catch(err => console.log('Error:', err));
};

controller.destroy = (req, res) => {
  const id = req.params.list_id;
  console.log("in the controller: id is ",id);

  List
    .destroy(id)
    .then((data) => {
      res.json(data)
    })
    .catch(err => console.log('Error: ', err));
};

module.exports = controller;
