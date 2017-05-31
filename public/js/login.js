$(document).ready(() => {
  console.log('login script loaded');

  $('#signup').on('submit', () => {
    console.log('sign up clicked');
    window.location.replace("users/new");
  });

  $('.new-user-form').on('submit', (e) => {
    e.preventDefault();
    console.log("clicked");
    const userName = $('.name-input').val();
    //create an user on users table
    $.ajax({
      url: '/users',
      type: 'POST',
      data: {name: userName},
      success: res => {
        console.log(res);
        window.location.replace(`/trips/users/${res.id}`);
      },
      error: err => {
        console.log(err);
      }
    });
  });

});
