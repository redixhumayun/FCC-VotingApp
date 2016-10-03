(function() {
 $(document).ready(function() {

  //This is where my code starts
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/', null, function(data) {

   data = JSON.parse(data); //parsing the data from JSON string to JSON object
   console.log(data);

   createPollList(data); //calls the function to dynamically generate the list of polls



   //the fb object checks for a change in the status 
   FB.Event.subscribe('auth.statusChange', function(response) {
    var responseObjToPass = JSON.stringify(response);
    console.log(responseObjToPass);
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/', responseObjToPass, function(string) {
     console.log(string);
    }));
    if (response.status == 'connected') {
     showNavBarElements();
    }
    else if (response.status == 'unknown') {
     hideNavBarElement();
    }
   });

   //The click event handler for clicking on one of the polls
   $('.ul-polls-title li').on('click', function() {
    ajaxCallForPollClick($(this).attr('class'));
   });

   //The click event handler for clicking on New Poll option from the navbar
   $('.liNewPoll').on('click', function() {
    window.open('https://fcc-votingapp-redixhumayun.c9users.io/poll-create', '_blank');
   });

   $('.liMyPolls').on('click', function() {
    window.open('https://fcc-votingapp-redixhumayun.c9users.io/my-polls', '_blank');
   });

  }));
 });
})();

//this is the function where the poll list is dynmically generated
function createPollList(data) {
 for (var i = 0; i < data.length; i++) {
  $('.ul-polls-title').append('<li class = "' + data[i]._id + '">' + data[i].title + '</li>');
 }
}

function ajaxCallForPollClick(poll_id) {

 var data = {};
 data.poll_id = poll_id;
 data = JSON.stringify(data); //stringify data to pass through without error


 ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/find-poll', data, function(data) {
  console.log(data);
  window.open('https://fcc-votingapp-redixhumayun.c9users.io/find-poll');
 }));

}

function showNavBarElements() {
 $('.liNewPoll').css('visibility', 'visible');
 $('.liMyPolls').css('visibility', 'visible');
}

function hideNavBarElement() {
 $('.liNewPoll').css('visibility', 'hidden');
 $('.liMyPolls').css('visibility', 'hidden');
}