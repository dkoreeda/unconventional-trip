const GoogleMaps = require('../../../services/googlemapsapi');
const Places = require('../../../models/places');

const controller = {};

controller.index = (req, res) => {
  const location = req.params.location;
  const search = req.params.search;
  // console.log("location", location);
  // console.log("search", search);
  GoogleMaps
    .findByLocation(location, search)
    .then(r => r.json())
    .then((data) => {
      // console.log(data);
      res.json(data);
    })
    .catch(err => console.log('Error:', err));
};

controller.show = (req, res) => {
  const id = req.params.id;
  Places
    .findById(id)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => { console.log('Error: ', err) })
};

controller.list = (req, res) => {
  const listId = req.params.list_id;
  Places
    .findPlacesByListId(listId)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => {console.log('Error: ', err)})
};

controller.fetch = (req, res) => {
  console.log(req.body);
  const body = req.body,
        type = body.type,
        keyword = body.keyword,
        lat = body.lat,
        lng = body.lng;

  const data = {
    type: type,
    keyword: keyword,
    lat: lat,
    lng: lng
  }

  console.log(data);

  GoogleMaps
    .findByLocation(data)
    .then(r => r.json())
    .then(data => {res.json(data)})
    .catch(err => {console.log(err)});
};

controller.create = (req, res) => {
  const body = req.body;
  const name = body.placeName,
        icon = body.placeIcon,
        rating = body.placeRating,
        user_id = body.user_id,
        list_id = body.list_id,
        place_id = body.placeId,
        lat = body.lat,
        lng = body.lng;

  const save = {
    place_id: place_id,
    name: name,
    icon: icon,
    rating: rating,
    user_id: user_id,
    list_id: list_id,
    lat: lat,
    lng: lng
  };

  console.log(save);

  Places
    .create(save)
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log('Error: ', err));
}

controller.update = (req, res) => {
  console.log(req.body);
  const id = req.body.place_id,
        // checked = req.body.checked,
        user_id = req.body.user_id;

  Places
    .update(id, user_id)
    .then ((data) => {
      res.json(data);
    })
    .catch(err => console.log('Error:', err));
};

controller.destroy = (req, res) => {
  const id = req.params.place_id;
  console.log("in the controller: id is ",id);

  Places
    .destroy(id)
    .then((data) => {
      res.json(data)
    })
    .catch(err => console.log('Error: ', err));
};


module.exports = controller;


// controller.cityid = (req, res) => {

//   const id = req.params.placeId;

//   console.log(id);

//   GoogleMaps
//     .findById(id)
//     .then(r => r.json())
//     .then((data) => {
//       // console.log(data);
//       res.json(data);
//     })
//     .catch(err => console.log('Error:', err));
// }
