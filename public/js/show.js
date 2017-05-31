$(document).ready(() => {
  console.log('login script loaded');

let userId;

  const hashes = window.location.href.slice(window.location.href.indexOf('/') + 1);
  console.log(hashes);
  for(let i = 0; i < hashes.length; i++) {
    hash = hashes.split('/');
    console.log(hash[3]);
    userId = hash[3];
  }
  console.log(userId);

  $('#return').attr("href", `http://localhost:3000/users/${userId}`);

  const deleteButton = document.querySelectorAll('.delete-item');

  for (let i = 0; i < deleteButton.length; i++) {
      // delete button
      $(deleteButton[i]).on('click', (e) => {
        console.log("delete button");
        console.log(deleteButton[i]);
        console.log(i);
        const targetPlace = deleteButton[i].parentNode;
        console.log(targetPlace.id);
        const id = targetPlace.id;

        $.ajax({
          type: 'DELETE',
          url: `/users/${userId}/places/${id}`,
          success: res => {
            console.log('success', res);
            window.location.replace(`/users/${userId}/places`);
          },
          error: msg => {
            console.log(msg)
          }
        });
      });
  }

  const inputComment = document.querySelectorAll('.comment');
  const addButtons = document.querySelectorAll('.new-comment');
  console.log(addButtons);
  console.log(typeof addButtons);

  for(let i = 0; i< addButtons.length; i++) {
    $(addButtons[i]).on('click', (e) => {
      console.log("clicked");
      const newComment = $(inputComment[i]).val();
      console.log(newComment);
      const place = addButtons[i].parentNode;
      const id = place.id;
      console.log(id);

      $.ajax({
        type: 'POST',
        url: `/users/${userId}/comments`,
        data: {
          comment: newComment,
          placeId: id,
          userId: userId
        },
        success: res => {
          console.log("success", res);
          // appendComments(res);
          // window.location.replace(`/users/${userId}/places`);
        },
        error: msg => {
          console.log(msg);
        }
      });
    })
  }

// const test = $('.container');
// console.log(test);
// test.each((index, item) => {
//   console.log(item.id);
//   $.ajax({
//     type: 'POST',
//     url: `/users/${userId}/places/${item.id}/comments`,
//     data: {
//       placeId: item.id,
//       userId: userId
//     },
//     success: res => {
//       console.log("success", res);
//       // appendComments(res);
//       window.location.replace(`/users/${userId}/places`);
//     },
//     error: msg => {
//       console.log(msg);
//     }
//   });
// })

  // const appendComments = (data) => {
  //   const placeId = data.place_user_id;


    // const activityId = $(`#${id}`);
    // console.log(activityId);

    // const comment = data.comment;
    // const commentId = data.comment_id;
    // const newP = $(`<p id="${commentId}">`);
    // newP.text(comment);

    // activityId.append(newP);
  // }


  // for (let i = 0; i < addButton.length; i++) {
  //   $(addButton[i]).on('click', (e) => {
  //       const comment = $(addComment[i]).val();

  //       $.ajax({
  //         type: 'PUT',
  //       //   url: `/users/comment/${res[i].id}`,
  //       //   data: res[i].id,
  //       //   success: res => {
  //       //     console.log('success');
  //             // appendComment(res);
  //       //     window.location.replace(`/users/${userId}/places`);
  //       //   },
  //       //   error: msg => {
  //       //     console.log(msg);
  //       //   }
  //       // });

  //   })
  // // }


});
