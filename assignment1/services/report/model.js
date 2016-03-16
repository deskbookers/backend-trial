"use strict";
var _ = require('lodash');
var moment = require('moment');
module.exports = function ReportModel(config) {
	var INTEREST = config.report.interest;
	var virgilio = this;
	var model = virgilio.namespace$('report.model');

	model.defineAction$(function getLTVBetweenTimestamp(startTimestamp, endTimestamp) {
		return getBookingsBetween(startTimestamp, endTimestamp)
			.then(aggregateResults)
			.then(convertToArray)
			.then(calculateInterest);
	});

	function calculateInterest(aggregatedBookings) {
		return aggregatedBookings.map(function calculateInterest(bookings) {
			bookings.averageBookings = bookings.numberOfBookings / bookings.numberOfBookers;
			bookings.averageTurnover = bookings.totalTurnover / bookings.numberOfBookings;
			bookings.lifeTimeValue = bookings.averageTurnover * INTEREST;
			return bookings;
		});
	}

	/*
		Convert to array
		data in: {
			'YYYY-MM':{
				numberOfBookings: int,
				totalTurnover: float,
				numberOfBookers int
			}...
		}
		data out: [
			[{
				date: 'YYYY-MM',
				numberOfBookings: int,
				totalTurnover: float,
				numberOfBookers: int
			}]
		]
	*/
	function convertToArray(aggregatedBookings) {
		var ret = [];
		var groupKeys = _.sortBy(_.keys(aggregatedBookings));

		groupKeys.forEach(function createArrayFromObjectKeys(groupKey) {
			ret.push({
				date: groupKey,
				numberOfBookings: aggregatedBookings[groupKey].numberOfBookings,
				totalTurnover: aggregatedBookings[groupKey].totalTurnover,
				numberOfBookers: aggregatedBookings[groupKey].numberOfBookers
			});
		});

		return ret;
	}

	/*
		Aggregate results
		data in: [
			{ 	booker_id: 23153,
			    number_of_bookings: int,
			    total_turnover: float,
			    first_booking: int //unix timestamp
			}...]
		aggregated data out, date generated from fist_booking: {
			'YYYY-MM':{
				numberOfBookings: int,
				totalTurnover: float,
				numberOfBookers int
			}...
		}
	*/
	function aggregateResults(rows) {
		var aggregatedResult = {};
		
		rows.forEach(function aggregateRows(row){
			var groupKey = moment.unix(row.first_booking).format('YYYY-MM');
			
			if(!_.has(aggregatedResult, groupKey)) {
				aggregatedResult[groupKey] = {numberOfBookings: 0, totalTurnover: 0, numberOfBookers: 0};
			}

			aggregatedResult[groupKey].numberOfBookers += 1;
			aggregatedResult[groupKey].totalTurnover += row.total_turnover;
			aggregatedResult[groupKey].numberOfBookings += row.number_of_bookings;
		});
		
		return aggregatedResult;
	}

	function getBookingsBetween(startTimestamp, endTimestamp) {
		return new virgilio.Promise(function getBookings(reject, resolve) {
			var query = 'SELECT * FROM (SELECT b.booker_id, count(locked_total_price) as number_of_bookings, sum(locked_total_price) as total_turnover, min(end_timestamp) as first_booking FROM bookingitems bi JOIN bookings b ON (bi.booking_id = b.id) GROUP BY b.booker_id) WHERE first_booking > $startTimestamp and first_booking < $endTimestamp ORDER BY first_booking asc';
			var params = {$startTimestamp: startTimestamp, $endTimestamp: endTimestamp};
			
			virgilio.db.all(query, params, function returnRowsOrRejectErr(rows, err){
				if(err) return reject(err);
				resolve(rows);
			});
		});
	}
}