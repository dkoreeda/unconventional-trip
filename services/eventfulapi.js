const fetch = require('node-fetch');

const Eventful = {};

// const date = $('event-type') : date ? "today";

Eventful.findByDate = (date)=> {
  return fetch('http://api.eventful.com/json/events/search?app_key=CL9wnQhhLKcv3Z7W&date='+date+'l=sao+paulo', {
    headers: {
      'X-AMC-Vendor-Key': '31dd5ae1-9562-4b1f-b718-f8b1a3a97492'
    },
  })
}

module.exports = Eventful;

