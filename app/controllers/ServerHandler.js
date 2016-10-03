'use strict';

var data_model = require('../model/data-modeling.js');
var formidable = require('formidable');
var utility = require('../common/utility-functions.js');

function ServerHandler() {
	var user_id; //variable to assign user_id to

	this.getPolls = function(db, callback) {
		var cursor = db.collection('polls').find({});
		cursor.toArray(function(err, docs) {
			if (err) {
				console.log(err);
			}
			if (docs) {
				callback(docs);
			}
		});
	};

	this.newPoll = function(req, res, db, callback) {

		var title = req.body.formData[0].value;

		var options = req.body.formData[1].value;

		var facebookData = req.body.facebookData;
		console.log('Inside this.newPoll');
		console.log(facebookData);

		//Replacing the string with a comma seperated list
		options = utility.RegexpString(options);

		//using a different function to find the number of options entered by the user
		var count = utility.CountOptions(options);
		console.log(count);

		//create an object to embed as part of the below database for option entries
		var counters = utility.CounterObject(count);
		console.log(counters);

		console.log(options);

		data_model.insertPoll(db, title, options, facebookData.userID, counters, function(doc) {
			console.log(doc);
			user_id = doc.ops[0]._id;
			callback(user_id);
		});
	};

	//This method is used to check and return the document according to the user_id passed through

	this.check = function(db, user_id, callback) {
		console.log(user_id);
		data_model.findCreatedPoll(db, user_id, function(err, doc) {
			if (err) {
				callback(err, doc);
			}
			if (doc) {
				callback(null, doc);
			}
		});
	};

	//This method is used to increment the counter of a specific field of the options_counter object everytime the user selects that option
	this.addPollResult = function(db, user_id, field, callback) {
		console.log('Inside addPollResult');
		console.log(user_id);
		data_model.addPollResult(db, user_id, field, function(doc) {
			console.log('This document was just added');
			console.log(doc);
			callback(doc);
		});
	};
	
	//this method is used to return a users polls
	this.getPollsByUser = function(db, fbID, callback){
		console.log('Inside getPollsByUser');
		console.log(fbID);
		data_model.getPollsByUser(db, fbID, function(err, doc){
			if(err){
				console.log(err);
				throw err;
			}
			callback(null, doc);
		});
	};

	this.deletePoll = function(db, user_id, fbID,callback) {
		data_model.deletePoll(db, user_id, fbID ,function(deleteCount) {
			callback(deleteCount);
		});
	};
	
	this.checkForEmptyObject = function(obj){
		for(var prop in obj){
			if(obj.hasOwnProperty(prop)){
				return false;
			}
		}
		return true;
	};

	//return user_id; //This user_id is being returned from where the data_model.insertPoll method is being called. Put it here to ensure that this.check can be reached. Might need to refactor this part as removing this.check functionality from this area. 
}

module.exports = ServerHandler;