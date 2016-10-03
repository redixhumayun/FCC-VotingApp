(function() {
    $(document).ready(function() {
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/my-polls', null, function(data) {
            data = JSON.parse(data);
            console.log(data);

            createPollList(data);

            $('.ul-polls-title li').on('click', function() {
                ajaxCallForPollClick($(this).attr('class'));
            });
        }));
    });
})();

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
    
    $('.liHome').on('click', function(){
       window.open('https://fcc-votingapp-redixhumayun.c9users.io'); 
    });
}