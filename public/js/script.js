$(document).ready(() => {
  console.log('script loaded');

  //-------------- VARIABLES ------------------------------------------
  //save relevant info from api results
  let all = [],
      allEventsMarkers = [],
      allMarkers = [],
      allLocationLatLng = [],
      infoEvent = null,
      map;

  //-------------- FROM GOOGLE MAPS API TUTORIAL ----------------------

  const initialize = (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    // console.log(latitude);
    // console.log(longitude);

    //grab this code from google maps documentation
    const mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng (latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //geolocation
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  navigator.geolocation.getCurrentPosition(initialize);

  // infoEvent = new google.maps.InfoWindow({
  //   content: 'holding...'
  // });

  //--------------- EVENTFUL API --------------------------------------

  $('button').on('click', e => {
    console.log("clicked");
    e.preventDefault();
    // const location = $('.city').val();
    const date = $('.event-date').val();
    getData(date);
    return false;
  });

  //extract info from api results
  const getData = (date) => {
    $.ajax({
      url: '/api/eventful/schedule/', //'/api/restaurants/'+location
      type: 'GET',
      dataType: 'json',
      success: response => {
        // console.log(response.events.event);
        handleData(response.events.event);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  const handleData = (events) => {
    // console.log(events);
    for (let i = 0; i < events.length; i++) {
      console.log(events[i]);
      const latitude = parseFloat(events[i].latitude);
      const longitude = parseFloat(events[i].longitude);
      const title = events[i].title;

      googleMaps(latitude, longitude);
    }
  }
  const handleGoogleData = (results) => {
    // console.log("testing argument:", results);
    for (let i = 0; i < results.length; i++) {
      let geometry = results[i].geometry;
      // console.log("geometry results:", geometry);
      let location = geometry.location;
      console.log("location:", location);


      const latitude = location.lat;
      const longitude = location.lng;
      // const title = events[i].title;

      // console.log("latitude", typeof latitude);
      // console.log("longitude", longitude);

      const myLatLng = {lat: latitude, lng: longitude};
      // console.log(typeof myLatLng);
      // console.log("myLatLng", myLatLng);

      const marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
      });

      allLocationLatLng.push(allMarkers);
    }
  }

  const googleMaps = (latitude, longitude) => {
    console.log("latitude type is: ", typeof latitude);
    console.log("longitude type is: ", typeof longitude);
      $.ajax({
        url: '/api/maps/fetchGoogleMaps',
        type: 'GET',
        success: (res) => {
          // console.log(res.results);
          handleGoogleData(res.results);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  // //extract info from api results
  // const getData = (date) => {
  //   $.ajax({
  //     url: '/api/schedule/'+date, //'/api/restaurants/'+location
  //     type: 'GET',
  //     dataType: 'json',
  //     success: response => {
  //       // console.log(response.events.event);
  //       handleData(response.events.event);
  //     }
  //   })
  // }





  //-------------- FROM GOOGLE MAPS API TUTORIAL ----------------------

  var bounds = new google.maps.LatLngBounds ();
                //  Go through each...
  for (let i = 0; i < allLocationLatLng.length; i++) {
    //  And increase the bounds to take this point
    bounds.extend (allLocationLatLng[i]);
    //  Fit these bounds to the map
    map.fitBounds(bounds, bounds);
  }

});

