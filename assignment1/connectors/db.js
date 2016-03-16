"use strict";
module.exports = function DbModule(config) {
	var virgilio = this;
	var connector = virgilio.namespace$('db');
	
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('./db/assignment1.db');

	connector.all = function(query, params, callback) {
		db.all(query, params, callback);
	};
}