$(document).ready(() => {
  // console.log('script loaded');

  //-------------- VARIABLES ------------------------------------------
  //save relevant info from api results
  // let all = [],
      // allEventsMarkers = [],
  let userName,
      allLatLng = [],
      markers = [],
      map,
      infoLocation = [],
      allinfoLocations = [],
      userId,
      hash;

  //--------------- GRAB USER ID FROM URL -----------------------------

  const hashes = window.location.href.slice(window.location.href.indexOf('/') + 1);
  // console.log(hashes);
  for(let i = 0; i < hashes.length; i++) {
    hash = hashes.split('/');
    // console.log(hash[3]);
    userId = hash[3];
  }
  // console.log(userId);

  //-------------- FROM GOOGLE MAPS API TUTORIAL ----------------------

  const initialize = (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    // console.log(latitude);
    // console.log(longitude);

    //grab this code from google maps documentation
    const mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng (latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
    };

    //geolocation
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  navigator.geolocation.getCurrentPosition(initialize);

  //--------------- EVENTFUL/GOOGLE MAPS API --------------------------------------

  $('button').on('click', e => {
    // console.log("clicked");

    e.preventDefault();

    // userName = $('.username').val();
    const location = $('.city').val();
    const search = $('#searchlist').val();
    // console.log("search option:", search);
    // const date = $('.event-date').val();
    getData(location, search);
    return false;
  });

  // //extract info from evetful api
  // const getBydate = (date) => {
  //   $.ajax({
  //     url: '/api/eventful/schedule/',
  //     type: 'GET',
  //     dataType: 'json',
  //     success: response => {
  //       // console.log(response.events.event);
  //       handleData(response.events.event);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     }
  //   })
  // }

  //extract info from api results
  const getData = (location, search) => {
    $.ajax({
      url: '/maps/fetchGoogleMaps/'+location+'/'+search,
      type: 'GET',
      success: response => {
        console.log(response.results);
        handleData(response.results);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  const appendData = (name, rating, icon) => {
    const title = $('<h3>');
    title.text(name);
    const rate = $('<h4>');
    rate.text(`Rating: ${rating}`);
    const img = $('<img>');
    img.attr("src", icon);
    const list = $('.search-results');
    list.append(title);
    list.append(rate);
    list.append(img);
  }

  const handleData = (data) => {
    // console.log   (data);
    // markers = [];

    for (let i = 0; i < data.length; i++) {
      appendData(data[i].name, data[i].rating, data[i].icon);

      const geometry = data[i].geometry;
      const location = geometry.location;
      const latitude = parseFloat(location.lat);
      const longitude = parseFloat(location.lng);
      // console.log("latitude", latitude);
      // console.log("type of latitude", typeof latitude);

      const myLatLng = {lat: latitude, lng: longitude};
      // console.log(typeof myLatLng);
      // console.log("myLatLng", myLatLng);

      const content = `<div class="markerInfo ${i}" >`+
                      `<h1>` + data[i].name + '</h1>' +
                      // '<img src="' + data[i].icon +'" >' +
                      `<h2>Rating: ` + data[i].rating + ' </h2>' +
                      // `<button id="${i}" onClick="handleClick()" class="save-button-${i}">Save</button>` +
                      `<button id="${i}" class="save-button-${i}">Save</button>` +

                      '</div>';

      infoLocation[i] = new google.maps.InfoWindow({
        content: content
      });

      markers[i] = new google.maps.Marker({
        position: myLatLng,
        map: map,
      });

      allinfoLocations.push(infoLocation[i]);

      markers[i].addListener('click', () => {
        // console.log("clicked");

        infoLocation[i].open(map, markers[i]);

        $('body').on('click', '.save-button-'+i, (e) => {
            // console.log("clicked save button");
            // console.log("user id", userId);
            fetchLists(data[i].name, data[i].rating, userId, i, latitude, longitude);
        });
      });
    }
  }

  const fetchLists = (placeName, placeRating, userId, i, latitude, longitude) => {
    $.ajax({
      url: `/lists/fetch`,
      type: 'POST',
      data: {userId: userId},
      success: res => {
        // console.log(res);
        appendLists(res, placeName, placeRating, userId, i, latitude, longitude);
      },
      error: msg => { console.log(msg); }
    });
  }

  const appendLists = (res, placeName, placeRating, userId, i, latitude, longitude) => {
    // console.log(res);
    $(res).each((index, item) => {
      // console.log(item);

      const list = $(`<div id="${item.list_id}">`);
      list.text(item.name);
      $(`.${i}`).append(list);

      $(list).on('click', (e) => {
        // console.log('list was clicked', list);
        savePlace(item.list_id, placeName, placeRating, userId, latitude, longitude);
      })
    })
  }

  const savePlace = (listId, placeName, placeRating, userId, latitude, longitude) => {
    // console.log('hit savePlace function');
    $.ajax({
      url: '/maps/places',
      type: 'POST',
      data: {
        placeName: placeName,
        placeRating: placeRating,
        user_id: userId,
        list_id: listId,
        lat: latitude,
        lng: longitude
      },
      success: (res) => {
        console.log(res);
      },
      error: msg => {
        console.log(msg);
      }
    });
  }


  //-------------- FROM GOOGLE MAPS API TUTORIAL ----------------------

  //doesn't work

  // for (let i = 0; i < allLatLng.length; i++) {
  //     const bounds = new google.maps.LatLngBounds ();
  //     bounds.extend(allLatLng[i]);
  //     map.fitBounds(bounds);
  // }

  //-------------------------------------------------------------------

});

