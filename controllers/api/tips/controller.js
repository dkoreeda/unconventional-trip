const SharedList = require('../../../models/sharelist');
const Places = require('../../../models/places');
const List = require('../../../models/lists');

const controller = {};

controller.index = (req, res) => {
  res.render('tips/index');
};

controller.showSharedLists = (req, res) => {
  SharedList
    .findAll()
    .then(data => res.json(data))
    .catch(err => console.log(err));
}

controller.fetchList = (req, res) => {
  const id = req.params.list_id;

  List
    .findById(id)
    .then(data => res.json(data))
    .catch(err => console.log(err));
}

controller.share = (req, res) => {
  const body = req.body;
  console.log(body);
  const name = body.name;
  const id = body.list_id;

  SharedList
    .create(id, name)
    .then(data => { res.json(data)})
    .catch(err => console.log('Err: ', err));
};

controller.findLists = (req, res) => {
  const body = req.body;
  console.log(body);
  const keyword = body.search;
  List
    .search(keyword)
    .then(data => {
      res.json(data);
    })
    .catch(err => {console.log(err)});
}

module.exports = controller;
