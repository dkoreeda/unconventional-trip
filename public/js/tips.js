$(document).ready(() => {
  console.log("script loaded");

  let userId,
      markers = [],
      places,
      map,
      lastOpenedInfoWindow;

  const hashes = window.location.href.slice(window.location.href.indexOf('/') + 1);

  for(let i = 0; i < hashes.length; i++) {
    hash = hashes.split('/');
    userId = hash[3];
  }

  $('#profile').attr("href", `http://localhost:3000/users/${userId}`);
  $('#search').attr("href", `http://localhost:3000/users/${userId}/search`);
  $('#lists').attr("href", `http://localhost:3000/lists/${userId}`);
  $('#bloggers').attr("href", `http://localhost:3000/tips/${userId}`);

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
  }

  navigator.geolocation.getCurrentPosition(initialize);

  const fetchLists = () => {
    // console.log("fetchLists");
    $.ajax({
      url: `/lists/fetch`,
      type: 'POST',
      data: {userId: userId},
      success: res => {
        console.log(res);
        appendListsCollection(res);
      },
      error: msg => { console.log(msg); }
    });
  }

  $.ajax({
    url: '/tips/sharedlist',
    method: 'GET',
    success: response => {
      console.log(response);
      fetchListInfo(response);
    },
    error: err => {
      console.log(err);
    }
  });

  const fetchListInfo = (data) => {
    data.forEach((listId, index) => {
      // console.log(listId);
      $.ajax({
        url: `/tips/list/${listId.list_u_id}`,
        method: 'GET',
        success: res => {
          console.log(res);
          appendList(res);
        },
        error: err => {
          console.log(err);
        }
      });
    });
  }

  const appendList = (list) => {
    console.log(list);
    const listDiv = document.getElementById('all');

    const anchor = document.createElement('h3');
    anchor.setAttribute('class', 'link');
    anchor.textContent = list.list_name;

    listDiv.appendChild(anchor);

    anchor.addEventListener('click', () => {
      console.log("clicked");

      const saveBtn = document.createElement('input');
      saveBtn.setAttribute('type', 'submit');


      clearMarkers();

      $.ajax({
          url: `/maps/list/${list.list_id}/places`,
          method: 'GET',
          success: res => {
            console.log(res);
            showListInfo(res, list);
          },
          error: err => {console.log(err)}
      });
    });
  }

  const showListInfo = (res, list) => {
    console.log(list);

    // Create a marker for each place found, and
    // assign a letter of the alphabetic to each marker icon.
    res.forEach((item, index) => {
        console.log(item);

        let lat = parseFloat(item.lat);
        let lng = parseFloat(item.lng);
        // console.log(typeof lat);
        let location = {lat: lat, lng: lng};

        // Use marker animation to drop the icons incrementally on the map.
        markers[index] = new google.maps.Marker({
          position: location,
          map: map
        });

        centralizeMap();
        google.maps.event.addListener(markers[index], 'click', () => {
          fetchLists();
          showInfoWindow(item, markers[index], lat, lng, index);
        });
    });
  }

  const centralizeMap = () => {
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
     bounds.extend(markers[i].getPosition());
    }

    map.fitBounds(bounds);
  }

  const showInfoWindow = (item, marker, lat, lng, i) => {
    console.log(item.user_id);
    // console.log(typeof item.rating);
    closePreviousInfoWindow();

    let ratingHtml = '';
    if (item.rating) {
      rating = parseFloat(item.rating);
      for (let i = 0; i < 5; i++) {
        if (rating < (i + 0.5)) {
          ratingHtml += '&#10025;';
        } else {
          ratingHtml += '&#10029;';
        }
      }
    }

    const content = '<table>'+
                `<tr>
                    <td><img class="icon" src="${item.google_icon}"/></td>
                    <td>${item.name}</td>
                </tr>` +
                `<tr>
                    <td class="infowindow">Rating:</td>
                    <td> ${ratingHtml}</td>
                </tr>` +
                `<tr>
                    <td>Move to:</td>
                    <td><select id="select-list"></select>
                </tr>`+
                `<tr>
                    <td></td>
                    <td><input id="save-${i}" type="submit" value="Add"><button id="new-list">Create new</button></td>
                </tr>` +
                '</table>';

    const infoWindow = new google.maps.InfoWindow({
      content: content
    });

    infoWindow.open(map, marker);
    lastOpenedInfoWindow = infoWindow;

    $('body').on('click', `#save-${i}`, (e) => {
      const saveList = $('#select-list').val();
      savePlace(item, i, saveList);
    });

    $('body').on('click', '#new-list', (e) => {
      // console.log("clicked");
      const modalCreateNewList = $('<div class="new-list">');
      const labelList = $('<h3 id="label-list">');
      labelList.append('Please enter a new label name:');
      const createNewList = $('<input id="input-new-list" type="text">');
      const createNewListButton = $('<button id="create-list">Create</button>')
      const cancelButton = $('<button id="cancel">Cancel</button>');

      $('body').on('click', '#create-list', (e) => {
        const newList = createNewList.val();
        // console.log(newList);
        $.ajax({
          url: '/lists',
          method: 'POST',
          data: {
            list: newList,
            user: userId
           },
          success: response => {
            console.log(response);
            window.location.replace(`/tips/${userId}`);
          },
          error: err => {
            console.log(err);
          }
        })
      });

      $(modalCreateNewList).append(labelList);
      $(modalCreateNewList).append(createNewList);
      $(modalCreateNewList).append(createNewListButton);
      $(modalCreateNewList).append(cancelButton);
      $('.container').append(modalCreateNewList);

      $('body').on('click', '#cancel', () => {
        console.log("clicked");
        $(modalCreateNewList).attr('style', 'display: none');
      });

    });
  }

  const appendListsCollection = (res) => {
    // console.log("appendLists");
    // $('#lists').empty();
    console.log(res);
    if(res.length === 0) {
      const list = $(`<option>`);
      list.text("No lists available");
      $('#select-list').append(list);
    } else {
      $(res).each((index, item) => {
        console.log(item);

        const list = $(`<option value="${item.list_id}">`);
        list.text(item.list_name);
        $('#select-list').append(list);
      });
    }
  }

  const savePlace = (item, i, list) => {
    console.log("save Place", item, list);
    console.log(i);
    const place = {
      placeIcon: item.google_icon,
      placeId: item.google_place_id,
      lat: item.lat,
      lng: item.lng,
      list_id: list,
      placeName: item.name,
      placeRating: item.rating,
      user_id: userId
    }
    console.log(place);
    $.ajax({
      url: '/maps/places',
      method: 'POST',
      data: place,
      success: res => {
        console.log(res);
      },
      error: err => {
        console.log(err);
      }
    });
  }
  const clearMarkers = () => {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }
    markers = [];
  }

  const closePreviousInfoWindow = () => {
    if(lastOpenedInfoWindow){
      console.log("previous info window was closed");
      lastOpenedInfoWindow.close();
    }
  }

  $('#list').keyup(function(e){
    console.log("keyup");
    searchInput(e);

  });

  const searchInput = (e) => {
    $('#all').empty();

    var data = {
      "search" : $(e.target).val()
    }
    $.ajax({
      method: "POST",
      data: data,
      url: "/tips/find_lists",
      success: function(lists){
        console.log(lists);
        // dropDownOptions(schools)
      },
      error: function(err){
        console.log(err);
      }
    });
  }

});
