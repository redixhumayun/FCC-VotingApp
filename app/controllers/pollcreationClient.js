(function() {
    $(document).ready(function() {
        if (typeof FB !== 'undefined' && FB !== null) { //this if statement is to ensure FB object loads before doing anything else 

            FB.Event.subscribe('auth.authResponseChange', function() {
                FB.getLoginStatus(function(response) {

                    var data = {}; //setting up the data object to fill with objects

                    $('.submit-butt').on('click', function() {

                        data.formData = $('form').serializeArray(); //this is the form data from the form
                        data.facebookData = response.authResponse; //facebook object data
                        console.log(data);

                        data = JSON.stringify(data); //this is done to pass the data and parse it through body parser. Not sure why it works this way. 
                        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/poll-create', data, function() {
                            window.open('https://fcc-votingapp-redixhumayun.c9users.io/new-poll', '_self');
                        }));

                        return false; //setting this statement to false ensures that the form data does not automatically submit independent of the AJAX call 
                    });
                });
            });

        }
        else {
            location.reload(); //reloads the page in case the if statement is not satisfied. 
        }

    });
})();
