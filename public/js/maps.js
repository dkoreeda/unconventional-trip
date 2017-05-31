  $( function() {
    console.log("maps loaded");

  let userId,
      listId,
      markers = [],
      map;
  const MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';

  const hashes = window.location.href.slice(window.location.href.indexOf('/') + 1);
  // console.log(hashes);
  for(let i = 0; i < hashes.length; i++) {
    hash = hashes.split('/');
    // console.log(hash[5]);
    userId = hash[3];
    listId = hash[5];
    console.log(listId);
  }

  const initialize = (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    console.log(latitude);

    const mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng (latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.LARGE,
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    getGeolocation();
  }

  navigator.geolocation.getCurrentPosition(initialize);

  const getGeolocation = () => {
    $.ajax({
      url: `/maps/list/${listId}/places`,
      method: 'GET',
      success: res => {
        // console.log(res);
        createMarkers(res);
      },
      error: err => {console.log("Error: ",err)}
    })
  }

  const createMarkers = (data) => {
    console.log(data);

    // Create a marker for each place found, and
    // assign a letter of the alphabetic to each marker icon.
    data.forEach((result, index) => {
      console.log(result);
        let lat = parseFloat(result.lat);
        let lng = parseFloat(result.lng);
        // console.log(typeof lat);
        let location = {lat: lat, lng: lng};

        // Use marker animation to drop the icons incrementally on the map.
        markers[index] = new google.maps.Marker({
          position: location,
          map: map
        });

    centralizeMap();
    });
  }

  const centralizeMap = () => {
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
     bounds.extend(markers[i].getPosition());
     // map.setCenter(mapBounds.getCenter());
     // map.setZoom(12);
    }

    map.fitBounds(bounds);
  }




  } );
