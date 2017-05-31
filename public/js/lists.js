$(document).ready(() => {
  console.log("script loaded");

  const activities = $('input[type="checkbox"]');
  const deleteLists = $('.delete-list');
  const deleteItems = $('.delete-item');
  const renameLists = $('button[type="reset"]');
  let listNames = $('span');
  let userId;

  const hashes = window.location.href.slice(window.location.href.indexOf('/') + 1);
  // console.log(hashes);
  for(let i = 0; i < hashes.length; i++) {
    hash = hashes.split('/');
    userId = hash[3];
  }

  console.log(userId);
  $('#profile').attr("href", `https://unconventionaltrip.herokuapp.com/users/${userId}`);
  $('#search').attr("href", `https://unconventionaltrip.herokuapp.com/users/${userId}/search`);
  $('#lists').attr("href", `https://unconventionaltrip.herokuapp.com/lists/${userId}`);
  $('#tips').attr("href", `https://unconventionaltrip.herokuapp.com/tips/${userId}`);

  $('#new-list').on('click', (e) => {
    const newList = $('#list').val();
    $.ajax({
      url: '/lists',
      method: 'POST',
      data: {
        list: newList,
        user: userId
       },
      success: response => {
        window.location.replace(`/lists/${userId}`);
      },
      error: err => {
        console.log(err);
      }
    })
  });

  $(activities).each((index, activity) => {
    if($(activity).hasClass("true")) {
      $(activity).prop("checked", true);
    }

    const activityId = activity.parentNode.id;

    $(activity).on('click', () => {

      data = {
        place_id: activityId,
        user_id: userId
      }

      $.ajax({
        url: '/maps/places',
        method: 'PUT',
        data: data,
        success: res => {
          console.log("success", res);
          window.location.replace(`/lists/${userId}/list/${listId}`);
        },
        error: err => { console.log("Error: ", err)}
      });

    });
  });

  $(deleteLists).each((index, list) => {
    $(list).on('click', () => {
      console.log("delete button was clicked");
      const listId = list.parentNode.id;
      console.log(listId);

      $.ajax({
        url: `/lists/${listId}`,
        method: 'DELETE',
        success: res => {
          console.log("success". res);
          window.location.replace(`/lists/${userId}`);
        },
        error: msg => { console.log("Error: ", msg)}
      })
    })
  });

  $(deleteItems).each((index, item) => {
    $(item).on('click', () => {
      console.log("delete button was clicked");
      const itemId = item.parentNode.id;
      console.log(itemId);

      $.ajax({
        url: `/maps/${itemId}`,
        method: 'DELETE',
        success: res => {
          console.log("success". res);
          window.location.replace(`/lists/${userId}/list/${listId}`);
        },
        error: msg => { console.log("Error: ", msg)}
      })
    })
  });

  $(renameLists).each((index, list) => {
    console.log(list);
    $(list).on('click', () => {
      console.log("rename button was clicked");
      const list_id = list.parentNode.id;
      const newName = $('<input type="text">');
      const save = $('<button class="save">Save</button>');
      $(list.parentNode).append(save);
      $(list.parentNode).append(newName);

      $('body').on('click', '.save', () => {
        const newNameList = newName.val();
        renameList(newNameList, list_id);
      });

    });
  });

  const renameList = (newName, listId) => {
    console.log("save clicked", newName);
    $.ajax({
      url: `/lists/${listId}`,
      method: 'PUT',
      data: {name: newName},
      success: res => {
        console.log("success", res);
        window.location.replace(`/lists/${userId}`);
      },
      error: msg => { console.log("Error: ", msg)}
    });
  }

  $('.share-list').each((index, list) => {
    console.log(list);
    $(list).on('click', (e) => {
      console.log(listNames[index]);
      const name = $(listNames[index]).text();
      const list_id = list.parentNode.id;

      data = {
        name: name,
        list_id: list_id
      }
      console.log(data);

      $.ajax({
        url: `/tips`,
        method: 'POST',
        data: data,
        success: res => {
          console.log("sucess", res);
          alert("You have shared a list");
        },
        error: msg => {console.log('Error ', msg)}
        });
      })


  });


})
