//This the function where a document is inserted into the database containing the title and the options input by the user. 
var ObjectId = require('mongodb').ObjectID; //requiring this to convert an _id string to an object to query mongo database with it

var data_modeling = {
    //here fbID is the facebook userID used for authentication
    insertPoll: function(db, title, options, fbID, counters, callback) {
        db.collection('polls').insert({
            title: title,
            options: options,
            fbID: fbID, 
            options_counter: counters
        }, function(err, document) {
            if (err) {
                throw new err;
            }
            console.log('Successfully inserted the document');
            callback(document);
        });
    },

    //This function returns the immediately created function via the AJAX call to populate the radio buttons
    //Might have to change this to return the document based on title rather than user_id
    findCreatedPoll: function(db, user_id, callback) {
        //This if statement is exclusively for requests that come in from the root page through the /find-poll route. Because the user_id passed through there is a string
        if(typeof user_id == 'string'){
            user_id = new ObjectId(user_id);
        }
        
        db.collection('polls').find({
            _id: user_id
        }).toArray(function(err, doc) {
            if (err) {
                throw new Error(err);
            }
            if (doc) {
                callback(null, doc);
            }
        });
    },

    //This method is used to increment the counter of a specific field of the options_counter object everytime the user selects that option
    addPollResult: function(db, user_id, field, callback) {
        console.log(typeof user_id);
        console.log(user_id);
        
        if(typeof user_id == 'string'){
            user_id = new ObjectId(user_id);
        }

        //Check if custom option already exists, if it does not, then add a new option and a new options_counter variable and increment that 
        db.collection('polls').findOne({
            _id: user_id
        }, function(err, doc) {
            if (err) {
                throw err;
            }
            if (doc) {
                //call the method to add custom fields if they exist
                checkForCustomOption(db, user_id, field, doc, function(result, customFieldKey) {
                    
                    //This statement is executed when the custom field is inserted successfully
                    if (result == 'Custom') {
                        console.log('Ok this makes sense');
                        console.log(result);
                        field = customFieldKey;
                        updateDocumentAfterChecking(db, user_id, field, function(doc) {
                            callback(doc);
                        });
                    }
                    //This statement is executed when there was a problem inserting the custom field
                    else if (result == 'Error') {
                        console.log('There was an error');
                    }
                    //This statement is executed when the custom option was not selected by the user
                    else if (result == 'Not Custom') {
                        updateDocumentAfterChecking(db, user_id, field, function(doc) {
                            callback(doc);
                        });
                    }
                });
            }
        });
    },
    
    getPollsByUser: function(db, fbID, callback){
        db.collection('polls').find({
            fbID: fbID
        }).toArray(function(err, doc){
           if(err){
               throw err;
           } 
           else{
               callback(null, doc);
           }
        });
    },

    deletePoll: function(db, user_id, fbID ,callback) {
        
        db.collection('polls').deleteOne({
            _id: new ObjectId(user_id), 
        }, {
            fbID: fbID
        },function(err, result) {
            if (err) {
                throw err;
            }
            else {
                console.log(result.deletedCount);
                callback(result.deletedCount);
            }
        });
    }
};

//Use this function to check if the user entered a custom option. If the user did so, update the document and then reflect the changes
function checkForCustomOption(db, user_id, field, doc, callback) {
    var ctr = 0;
    console.log('Inside checkForCustomOption');
    console.log(field);


    var fieldToSet = {
        $set: {}
    };

    //seperating the string into a comma seperated array
    var string_options = doc.options.split(',');
    var keys = Object.keys(doc.options_counter);

    //The ctr will always equal string_options.length because when selected non-custom radio button, the digit value is being passed not the text value. But comparison is happenign with the text value of the radio buttons
    for (var i = 0; i < string_options.length; i++) {
        //everytime an option is checked against, the counter increments. 
        if (field !== string_options[i] && field !== keys[i]) {
            ctr++;
        }
        //when all the options have been checked against, it can be said with assurance that the option needs to be added. This is a custom option
        if (ctr == string_options.length) {
            console.log('This option needs to be added');
            doc.options += ', ' + field; //Updating the options field here for the doc

            fieldToSet.$set['options'] = doc.options;
            fieldToSet.$set['options_counter.' + string_options.length] = 0;
            InsertCustomField(db, user_id, fieldToSet, string_options, function(string) {
                if (string == 'Custom') {
                    callback(string, string_options.length);
                }
                else if (string == 'Error') {
                    callback(string, null);
                }

            });
        }
    }
    //this if statement is executed if no callbacks in the for loop return to the previous function. This implies that the option was not a custom option
    if (ctr !== string_options.length) {
        callback('Not Custom', null);
    }

}

//This function is used to actually insert the custom file after the check for custom option has been done. Returns to the checkForCustomOption function
function InsertCustomField(db, user_id, fieldToSet, string_options, callback) {
    console.log('this is in InsertCustomField');
    console.log(fieldToSet);
    //Update the db polls collection here with the new options value stored in the doc.options
    db.collection('polls').update({
            _id: user_id
        },
        fieldToSet,
        function(err, result) {
            if (err) {
                console.log('Error encountered in updating code to reflect custom option');
                callback('Error');
            }
            if (result) {
                callback('Custom');
            }
        });
}



//called from the constructor function immediately after the checkForCustomOption function returns. This function is used to increment the option selected by one
function updateDocumentAfterChecking(db, user_id, field, callback) {
    var fieldToIncrement = {
        $inc: {}
    };

    fieldToIncrement.$inc['options_counter.' + field] = 1;

    db.collection('polls').findOneAndUpdate({
            _id: user_id
        },
        fieldToIncrement, {
            returnOriginal: false
        },
        function(err, doc) {
            if (err) {
                console.log("Error updating the document");
            }
            if (doc) {
                callback(doc);
            }
        });
}

module.exports = data_modeling;