'use strict';


$(document).ready(function() {

  // km uniqueURL parse feature

  // grab pollID from uniqueURL

  // check for url with hash that is a number
  var browserHash = location.hash;

  if (browserHash) {
    // exclude a hash containing #login and #register,
    // split the hash at the '#' into an array, and
    // use the string at the 1st index as the pollID to load
    if (browserHash !== '#login' && browserHash !== '#register') {
        console.log('the hash part is: '+ browserHash);
        var splitHash = browserHash.split('#');
        var pollID_to_load = splitHash[1];

        console.log(splitHash);
        console.log(pollID_to_load);

        // do a showPoll GET request
        // load the data in a rendered poll
        poll_api.showPoll(pollID_to_load, showPollCb);
    }

  }




  // animate on register/login containers
  $('.register-a').on('click', function() {
    $('.API-register').fadeIn().removeClass('hidden');
  });

  $('.login-a').on('click', function() {
    $('.API-login').fadeIn().removeClass('hidden');
  });

  $('.register-a2').on('click', function() {
    $('.API-login').slideUp(300);
    $('.API-register').delay(600).slideDown(300).removeClass('hidden');
  });

  $('.login-a2').on('click', function() {
    $('.API-register').slideUp(300);
    $('.API-login').delay(600).slideDown(300).removeClass('hidden');
  });


  // create-new (poll) button click handler
  $('.user-messages').on('click', '.create-new', function() {

    $('#poll-creation-container').fadeIn().removeClass('hidden');

  });

  // or

 $('#create-edit-del-button-dashboard').on('click', '.create-new', function() {
    console.log('clicked');
    $('#poll-creation-container').fadeIn();
  });



  // edit poll button click handler
  $('#create-edit-del-button-dashboard').on('click', '#edit', function() {
    console.log('clicked');
    $('#poll-edit-container').fadeIn().removeClass('hidden');
  });



  // register event handler
  $('#register').on('submit', function(e) {
    e.preventDefault();
    var credentials = form2object(this);
    poll_api.register(credentials, regCb);

     // hide register container
    $('.API-register').slideUp();
  });





  // login event handler
  $('#login').on('submit', function(e) {
    e.preventDefault();
    var credentials = form2object(this);
    console.log(credentials);
    poll_api.login(credentials, loginCb);

    // hide login container
    $('.API-login').slideUp();

    // fade up user-messages and create-poll button
    $('.user-messages').fadeIn();
    $('.user-messages').html('<p>Welcome, ' + credentials.username + '. Create a poll!</p><button class="create-new">Create New Poll</button>');

    // add user feedback
    $('.messages-container h4').html('Welcome, ' + credentials.username);
    $('.wrapper').css("background-image", "url(assets/images/duck01_loRes_sketch.jpg");
  }).fadeIn('fast');



  // logout event handler -- stretch goal
  $('#logout').on('submit', function(e) {
    e.preventDefault();
    var credentials = form2object(this);

    poll_api.login(credentials, logoutCb);
  });



  // create new poll handler
  $('#create-poll').on('submit', function(e) {
    e.preventDefault();

    var data = form2object(this);
     console.log('the form will send ' + JSON.stringify(data, null, 4));

    poll_api.createPoll(data, createPollCb);

    // $(this).closest('#poll-creation-container').fadeOut();
    // On submit, msg fades out, create form fades out, message with URL (let's vote on it) fades in, GET request created poll data, Li with a-tag of poll w data-poll-id fades in poll list ul, poll container fades up, dates populated in (for each)? Buttons populate on.

  });



  // edit poll title handler
  $('#edit-poll').on('submit', function(e) {
    e.preventDefault();

    var id = $('#poll-creation-container').attr('data-pollid');
    var data = {
      _id: id,
      title: $('#updatePollTitle').val()

    };

    console.log('the form will send ' + JSON.stringify(data, null, 4));

    poll_api.editPoll(id, data, editPollCb);

    $(this).closest('#poll-edit-container').fadeOut();

  });



// km -- begin showPoll handler

  // showPoll handler for user poll list (READ)
  $('#poll-list').on('click', '.load-poll', function(e) {
    e.preventDefault();
    console.log('clicked');

    var id = $(this).closest('a').data('poll-id');
    console.log('poll id is ' + id);

    poll_api.showPoll(id, showPollCb);

  });

// km -- end showPoll handler

  // vote button click handler (put with AJAX request section)
  $('#vote-results-button-dashboard').on('click', '#vote', function() {
    console.log('clicked');

    var value = $('input[name="option"]:checked', '#rendered-poll').val();
    console.log("value is: " + value);

    var pollID = $('#rendered-poll').attr('data-currentpollid');
    console.log("poll id is: " + pollID);

    var data = {
      pollID: pollID,
      answer: value
    };

    console.log('the form will send this vote ' + JSON.stringify(data, null, 4));

    poll_api.votePoll(data, votePollCb);

    $('.user-messages').html('<p>Successful poll vote</p>');
  });

  // see results button click handler (put with AJAX request)
  $('#vote-results-button-dashboard').on('click', '#results', function() {
    console.log('clicked');

    var pollID = $('#rendered-poll').attr('data-currentpollid');
    console.log("poll id is: " + pollID);

    poll_api.resultsAgg(pollID, resultsAggCb);

  // km add jQuery animation
  $('#poll-results-container').fadeIn().removeClass('hidden');
  });

  // delete poll event handler
  $('#delete').on('click', function(e) {
    e.preventDefault();
    console.log('clicked');

    var getpollID = $('#poll-creation-container').attr('data-pollid');
    console.log("poll id is: " + getpollID);
    poll_api.deletePoll(getpollID, deletePollCb);

  });

  // On vote click, message container updates with "thanks for your vote, your vote is [answer]. Do you want to <see poll results>?

  // If no poll results, fade in "nobody's taken the poll, do you want to?" Yes/no. Yes... fade out poll res container, fade in rendered poll container.

  // Add X buttons to close windows.

}); // end doc ready function










