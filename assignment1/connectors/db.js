"use strict";
var bluebird = require('bluebird');

module.exports = function DbModule(config) {
	var virgilio = this;
	var connector = virgilio.namespace$('db');
	
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('./db/assignment1.db', sqlite3.OPEN_READONLY);

	connector.defineAction$(function getAllRows(queryObject) {
		connector.log$.info('Running queryObject:', queryObject);

		return bluebird.fromCallback(function runQuery(callback) {
			return db.all(queryObject.text, queryObject.values, callback);
		});
	});

	connector.log$.info('Connected to Db.');
}