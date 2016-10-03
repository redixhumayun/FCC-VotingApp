(function() {

    var value; //variable to store the value of the radio option selected
    var custom_flag = false; //flag variable to check whether Custom radio button was selected

    //This is where the AJAX request is initialized
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/find-poll', null, function(data) {
        console.log('Inside the findPollClient.js ajaxFunction');
        console.log(typeof data);
        console.log(data);

        //Parsing the data into JSON format below
        $(document).ready(function() {
            //this is the form data that has been provided via the AJAX request
            data = JSON.parse(data);
            console.log('Inside the first AJAX call in pollvisualizationClient');
            console.log(data);

            var options_count = data[0].options_counter; //this variable stores the options_counter, that is the number of options

            var options_array = getSeperatedOptions(data[0].options);

            var options_length = Object.keys(options_count).length; //finding out the length of the options_counter object in this line

            //updating the header element
            $('h1').html(data[0].title);

            //Invoking the function that will create all of the options required by the user
            createOptions(options_length, options_array);

            //This method here checks to see if the user has selected Custom as their option
            $('.radio-options').on('click', function() {
                var entered_value = getEnteredOption(options_length); //calling this function to check if Custom has been chosen.
                if (entered_value == options_length) { //parseInt of entered_value will return a NaN. Use this to check against the number that is returned for parseInt of the other radio buttons
                    $('.custom-div').show();
                    custom_flag = true; //set the custom flag to true here because Custom radio button was selected
                }
            });

            $('.btn-danger').on('click', function() {
                var dataToPass = {};
                dataToPass.id = data[0]._id;
                dataToPass = JSON.stringify(dataToPass);

                ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/new-poll/delete-poll', dataToPass, function(data) {
                    console.log('This is data: ' + data); //data contains the number of documents deleted
                    if (data == 0) {
                        console.log('Sorry you do not have authority to delete this document');
                        window.alert('Sorry you do not have authority to delete this document');
                    }
                    else {
                        window.alert('This document has been deleted');
                        window.open('https://fcc-votingapp-redixhumayun.c9users.io', '_self');
                    }
                }));
            });

            //Submit button event click handler
            $('.submit-butt').on('click', function() {
                console.log('Clicked the submit button');
                //if statement decides whether the radio button selected was the Custom radio button
                if (custom_flag == true) {
                    var entered_value = $('.custom-text').val();
                    value = entered_value; //assigning the local entered_value to a global value variable to use in the next AJAX function
                }

                //else if statement decides whether a radio option button is checked or not! Fires only if Custom not selected
                else if ($('.radio-options').is(':checked')) {
                    var entered_value = getEnteredOption(options_length); //Function call to get option entered by user. Returns the value of the radio button
                    value = entered_value; //assigning the local entered_value to a global value variable to use in the next AJAX function
                }

                //Fire this else statement if no option is selected but Submit button is clicked
                else {
                    window.alert('You need to choose an option before trying to submit');
                }

                if (value.length > 0) {
                    var dataToPass = {}; //defining this object to pass data as JSON
                    dataToPass.value = value;
                    dataToPass = JSON.stringify(dataToPass); //stringify data to pass it through without error

                    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/new-poll/option-entered', dataToPass, function(data) {

                        //This object contains the returned value from the above AJAX call 
                        data = JSON.parse(data);

                        var optionsArray = getSeperatedOptions(data.value.options); //Keep the difference between optionsArray and options_array in mind AT ALL TIMES!

                        //This function is used to convert the options_counter object to an array so that it can be used to render the chart using ChartJS
                        var options_counterArray = convertOptionsCounterToArray(data.value.options_counter);

                        //call to function to create chart here
                        createChart(optionsArray, options_counterArray);
                    }));
                }
                else {
                    window.alert('Hi!');
                }


            });
        });
    }));

})();



//This is where the single string obtained from the form is separated into an array of strings separated by commas
function getSeperatedOptions(str) {
    return str.split(',');
}

//This is where the seperate options for the radio buttons are created based on what the user entered
function createOptions(length, options) {
    //changing the very first element here
    $('#radio1').html(options[0]);
    $('.radio-options').attr('id', options[0]);

    //creating all the required radio buttons except the last one here
    for (var i = 1; i < length; i++) {
        $('.radio').append('<br>');
        $('.radio').append('<label><input type = "radio" id = "' + options[i] + '" value = "' + i + '" name = "options" class = "radio-options"/><p>' + options[i] + '</p></label>');
    }

    //creating the last radio button here
    $('.radio').append('<br>');
    $('.radio').append('<label><input type = "radio" id = "Custom" value = "' + length + '" name = "options" class = "radio-options"/><p>Custom</p></label>')
}

//This function is where the option selected by the user is obtained for use. Returns the value, which is a number, of the radio button selected. 
function getEnteredOption(length) {
    for (var i = 0; i <= length + 1; i++) {

        //checking to see which of the radio buttons has been selected
        if ($('input:radio[value=' + i + ']').prop('checked')) {
            var option_entered = $('input:radio[value=' + i + ']').attr('value');
            console.log(option_entered);
            return option_entered; // returns the value of the selected radio element. Use this to update the Mongo document. 
        }

    }
}

function convertOptionsCounterToArray(obj) {
    var arr = $.map(obj, function(el) {
        return el;
    });
    return arr;
}

function createChart(labels, data) {
    var ctx = $('#myChart');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF3333',
                    '#33C1FF',
                    '#ECFF33',
                    '#61FF33'
                ]
            }]
        },
        options: {
            animateRotate: true
        }
    });
}
