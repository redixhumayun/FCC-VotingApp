'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongo = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var session = require('express-session');


var app = express();

//using bodyparser json template
app.use(bodyParser.json());

//using bodyparser urlencoded template
app.use(bodyParser.urlencoded({
	extended: true
}));

//using session with a secret
app.use(session({
	secret:'secretkey', 
	resave:false, 
	saveUninitialized: false
}));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

var db; //database object from MongoDb

mongo.connect('mongodb://localhost:27017/fcc-voting', function(err, newDb) {
	if (err) {
		throw new Error('Database failed to connect');
	}
	else {
		console.log('Successfully connected to MongoDb database');
	}
	db = newDb;
	db.createCollection('polls', {
		autoIndexId: true
	});
	routes(app, db);
});

var port = process.env.PORT || 8080;


app.listen(port, function() {
	console.log('Node.js listening on port ' + port + '...');
});