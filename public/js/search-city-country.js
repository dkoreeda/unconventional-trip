$(document).ready(() => {

  let markers = [],
      map,
      places,
      infoLocation = [],
      autocomplete,
      countryRestrict = {'country': 'br'},
      allinfoLocations = [],
      userId,
      hash,
      lastOpenedInfoWindow;
  const MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
  const hostnameRegexp = new RegExp('^https?://.+?/');

  //--------------- GRAB USER ID FROM URL -----------------------------

  const hashes = window.location.href.slice(window.location.href.indexOf('/') + 1);
  // console.log(hashes);
  for(let i = 0; i < hashes.length; i++) {
    hash = hashes.split('/');
    // console.log(hash[3]);
    userId = hash[3];
  }
  // console.log(userId);

  //-------------------------------------------------------------------

  var countries = {
    'au': {
      center: {lat: -25.3, lng: 133.8},
      zoom: 4
    },
    'br': {
      center: {lat: -14.2, lng: -51.9},
      zoom: 3
    },
    'ca': {
      center: {lat: 62, lng: -110.0},
      zoom: 3
    },
    'fr': {
      center: {lat: 46.2, lng: 2.2},
      zoom: 5
    },
    'de': {
      center: {lat: 51.2, lng: 10.4},
      zoom: 5
    },
    'mx': {
      center: {lat: 23.6, lng: -102.5},
      zoom: 4
    },
    'nz': {
      center: {lat: -40.9, lng: 174.9},
      zoom: 5
    },
    'it': {
      center: {lat: 41.9, lng: 12.6},
      zoom: 5
    },
    'za': {
      center: {lat: -30.6, lng: 22.9},
      zoom: 5
    },
    'es': {
      center: {lat: 40.5, lng: -3.7},
      zoom: 5
    },
    'pt': {
      center: {lat: 39.4, lng: -8.2},
      zoom: 6
    },
    'us': {
      center: {lat: 37.1, lng: -95.7},
      zoom: 3
    },
    'uk': {
      center: {lat: 54.8, lng: -4.6},
      zoom: 5
    }
  };

  const fetchLists = () => {
    // console.log("fetchLists");
    $.ajax({
      url: `/lists/fetch`,
      type: 'POST',
      data: {userId: userId},
      success: res => {
        console.log(res);
        appendLists(res);
      },
      error: msg => { console.log(msg); }
    });
  }

  const appendLists = (res) => {
    // console.log("appendLists");
    $('#my-list').empty();
    // console.log(res);
    $(res).each((index, item) => {
      // console.log(item);

      const list = $(`<option value="${item.list_id}">`);
      list.text(item.list_name);
      $('#my-list').append(list);
    })
  }

  function initialize() {
    // console.log("initialize");

    const mapOptions = {
      zoom: countries['br'].zoom,
      center: countries['br'].center,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    fetchLists();
  }

  initialize();

  const hiddenList = document.getElementById('hidden-create-list');
  document.getElementById('create-list').addEventListener('click', () => {
    if (hiddenList.style.display === 'none') {
      hiddenList.style.display = 'block';
    }
  })

  $('#add-new-list').on('click', (e) => {
    const newList = $('#list').val();
    if (hiddenList.style.display === 'block') {
      hiddenList.style.display = 'none';
    }
    $.ajax({
      url: '/lists',
      method: 'POST',
      data: {
        list: newList,
        user: userId
       },
      success: response => {
        console.log(response);
        // window.location.replace(`/users/${userId}/search`);
        fetchLists();
      },
      error: err => {
        console.log(err);
      }
    })
  });

  const infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */ (
          document.getElementById('autocomplete')), {
        types: ['(cities)'],
        componentRestrictions: countryRestrict
      });

  places = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', onPlaceChanged);

  // Add a DOM event listener to react when the user selects a country.
  document.getElementById('country').addEventListener(
      'change', setAutocompleteCountry);

  // When the user selects a city, get the place details for the city and
  // zoom the map in on the city.
  function onPlaceChanged() {
    // clearResults();
    // clearMarkers();
    // document.getElementById('searchlist').value = '';
    // document.getElementById('autocomplete').value = '';

    var place = autocomplete.getPlace();
    console.log(place);

    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(12);
      console.log(place.geometry.location.lat());
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      appendCityName(place.name);
      fetch(lat, lng);
    } else {
      document.getElementById('autocomplete').placeholder = 'Enter a city';
      window.alert("No results found for "+place.name+"'.");
    }
  }

  // When user selects a city from autocomplete dropdown list, it names the container with result's list by
  // targeting the elem by id and triggers the fetch function
  const appendCityName = (city) => {
    // console.log(location);
    const search = document.getElementById('searchlist').value;
    document.getElementById('city').textContent = city + ` - ${search}`;
  }

  // The fetch function listen to a click event to send request to ajax call with data info (location and query)
  const fetch = (lat, lng) => {

    document.getElementById('fetch-call').addEventListener('click', e => {
      // console.log("search was clicked");
      const keyword = document.getElementById('searchlist').value;
      const type = document.getElementById('type').value;

      getData(type, lat, lng, keyword);

      const showMap = document.getElementById('show-results');

      if (showMap.style.display === 'block') {
        showMap.style.display = 'none';
      }

      return false;
    });
  }

  const getData = (type, lat, lng, keyword) => {
    // console.log("getData");
    console.log(keyword);
    const data = {
      lat: lat,
      lng: lng,
      keyword: keyword,
      type: type
    }

    $.ajax({
      url: '/maps/fetchGoogleMaps',
      type: 'POST',
      data: data,
      success: response => {
      clearResults();
      clearMarkers();
        console.log(response.results);
        handleData(response.results);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  const handleData = (data) => {
    // console.log("handleData");

    // Create a marker for each place found, and
    // assign a letter of the alphabetic to each marker icon.
    $(data).each((index, result) => {
        var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (index % 26));
        var markerIcon = MARKER_PATH + markerLetter + '.png';

        // Use marker animation to drop the icons incrementally on the map.
        markers[index] = new google.maps.Marker({
          position: result.geometry.location,
          animation: google.maps.Animation.DROP,
          icon: markerIcon
        });

        // If the user clicks a place marker, show the details of that place
        // in an info window.
        markers[index].placeResult = result;
        google.maps.event.addListener(markers[index], 'click', showInfoWindow);
        setTimeout(dropMarker(index), index * 100);
        addResult(result, index);
    });
  }

  // Get the place details for a hotel. Show the information in an info window,
  // anchored on the marker for the hotel that the user selected.
  function showInfoWindow() {
    var marker = this;
    places.getDetails({placeId: marker.placeResult.place_id},
        function(place, status) {
          // console.log(place);
          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            return;
          }
          closePreviousInfoWindow();
          infoWindow.open(map, marker);
          lastOpenedInfoWindow = infoWindow;
          // console.log(counter);
          const geo = marker.placeResult.geometry;
          const latitude = geo.location.lat;
          const longitude = geo.location.lng;
          buildIWContent(place, latitude, longitude);
        });
  }

  function dropMarker(i) {
    // console.log("dropMarker");
    return function() {
      markers[i].setMap(map);
    };
  }

  function addResult(result, i) {

    var results = document.getElementById('results');
    var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
    var markerIcon = MARKER_PATH + markerLetter + '.png';

    var tr1 = document.createElement('tr');
    tr1.setAttribute("id", i);
    tr1.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
    tr1.onclick = function() {
      google.maps.event.trigger(markers[i], 'click');
    };

    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var icon = document.createElement('img');

    icon.src = markerIcon;
    icon.setAttribute('class', 'placeIcon');
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    tr1.appendChild(iconTd);
    tr1.appendChild(nameTd);

    let saveButtonTd = document.createElement('td');
    let listTd = document.createElement('td');

    let saveButton = document.createElement('input');
    saveButton.setAttribute("id", i);
    saveButton.setAttribute('type', 'submit');
    saveButton.setAttribute('value', 'Save');

    let e = document.getElementById('my-list');
    let listId = e.options;
    let geometry = result.geometry;
    let location = geometry.location;
    saveButton.addEventListener('click', function(){savePlace(result.name, result.icon, result.rating, result.place_id, location.lat, location.lng, listId)}, false);

    saveButtonTd.appendChild(saveButton);
    tr1.appendChild(saveButtonTd);

    results.appendChild(tr1);
  }

  function clearResults() {
    var results = document.getElementById('results');
    while (results.childNodes[0]) {
      results.removeChild(results.childNodes[0]);
    }
  }

  function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }
    markers = [];
  }

  function closeMarkers() {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].close();
        markers[i].open = false;
      }
    }
  }

  function closePreviousInfoWindow() {
    if(lastOpenedInfoWindow){
      console.log("previous info window was closed");
      lastOpenedInfoWindow.close();
    }
  }

  // Set the country restriction based on user input.
  // Also center and zoom the map on the given country.
  function setAutocompleteCountry() {
    var country = document.getElementById('country').value;
    if (country == 'all') {
      autocomplete.setComponentRestrictions({'country': []});
      map.setCenter({lat: 15, lng: 0});
      map.setZoom(2);
    } else {
      autocomplete.setComponentRestrictions({'country': country});
      map.setCenter(countries[country].center);
      map.setZoom(countries[country].zoom);
    }
    clearResults();
    clearMarkers();
  }

  // Load the place information into the HTML elements used by the info window.
  // function buildIWContent(place, lat, lng, counter) {
  function buildIWContent(place, lat, lng) {

    document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
        'src="' + place.icon + '"/>';
    document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
        '" target="_blank">' + place.name + '</a></b>';
    document.getElementById('iw-address').textContent = place.vicinity;

    if (place.formatted_phone_number) {
      document.getElementById('iw-phone-row').style.display = '';
      document.getElementById('iw-phone').textContent =
          place.formatted_phone_number;
    } else {
      document.getElementById('iw-phone-row').style.display = 'none';
    }

    // Assign a five-star rating to the hotel, using a black star ('&#10029;')
    // to indicate the rating the hotel has earned, and a white star ('&#10025;')
    // for the rating points not achieved.
    if (place.rating) {
      var ratingHtml = '';
      for (var i = 0; i < 5; i++) {
        if (place.rating < (i + 0.5)) {
          ratingHtml += '&#10025;';
        } else {
          ratingHtml += '&#10029;';
        }
      document.getElementById('iw-rating-row').style.display = '';
      document.getElementById('iw-rating').innerHTML = ratingHtml;
      }
    } else {
      document.getElementById('iw-rating-row').style.display = 'none';
    }

    // The regexp isolates the first part of the URL (domain plus subdomain)
    // to give a short URL for displaying in the info window.
    if (place.website) {
      var fullUrl = place.website;
      var website = hostnameRegexp.exec(place.website);
      if (website === null) {
        website = 'http://' + place.website + '/';
        fullUrl = website;
      }
      document.getElementById('iw-website-row').style.display = '';
      document.getElementById('iw-website').textContent = website;
    } else {
      document.getElementById('iw-website-row').style.display = 'none';
    }
  }

  const savePlace = (name, icon, rating, placeId, lat, lng, listId) => {
    let list;

    for(let i = 0; i < listId.length; i++) {
      if(listId[i].selected){
        console.log(listId[i].value);
        list = listId[i].value;
      }
    }

    $.ajax({
      url: '/maps/places',
      type: 'POST',
      data: {
        placeName: name,
        placeIcon: icon,
        placeRating: rating,
        placeId: placeId,
        user_id: userId,
        list_id: list,
        lat: lat,
        lng: lng
      },
      success: (res) => {
        console.log(res);
      },
      error: msg => {
        console.log(msg);
      }
    });
  }

});
