const Eventful = require('../../../services/eventfulapi');

const controller = {};

controller.show = (req, res) => {
  const date = req.params.date;

  Eventful
    .findByDate(date)
    .then(r => r.json())
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log('Error:', err));
};

module.exports = controller;
