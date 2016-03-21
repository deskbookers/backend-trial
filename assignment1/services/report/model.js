'use strict';
var _ = require('lodash');
var moment = require('moment');
var squel = require('squel');

module.exports = function ReportModel(config) {
	var INTEREST = config.report.interest;
	var virgilio = this;
	var model = virgilio.namespace$('report.model');


	model.calculateAvgAndInterest = function calculateAvgAndInterest(bookings) {
		bookings.averageBookings = bookings.numberOfBookings / bookings.numberOfBookers;
		bookings.averageTurnover = bookings.totalTurnover / bookings.numberOfBookings;
		bookings.lifeTimeValue = bookings.averageTurnover * INTEREST;
		return bookings;
	};

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
	model.defineAction$(function convertToArray(aggregatedBookings) {
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
	});

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
	model.defineAction$(function aggregateBookings(bookings) {
		var aggregatedResult = {};
		
		bookings.forEach(function aggregateRows(booking){
			var groupKey = moment.unix(booking.first_booking).format('YYYY-MM');

			if (!_.has(aggregatedResult, groupKey)) {
				aggregatedResult[groupKey] = { numberOfBookings: 0, totalTurnover: 0, numberOfBookers: 0 };
			}

			aggregatedResult[groupKey].numberOfBookers += 1;
			aggregatedResult[groupKey].totalTurnover += booking.total_turnover;
			aggregatedResult[groupKey].numberOfBookings += booking.number_of_bookings;
		});

		return aggregatedResult;
	});

	model.defineAction$(function getBookingsBetween(startTimestamp, endTimestamp) {
		var subQuery = squel.select()
						.from('bookingitems', 'bi')
						.field('b.booker_id')
						.field('count(locked_total_price)', 'number_of_bookings')
						.field('sum(locked_total_price)', 'total_turnover')
						.field('min(end_timestamp)', 'first_booking')
						.join('bookings', 'b', 'bi.booking_id = b.id')
						.group('b.booker_id');

		var query = squel.select()
						.from(subQuery)
						.where('first_booking > ?', startTimestamp)
						.where('first_booking < ?', endTimestamp)
						.order('first_booking', true); //true === asc

		return new virgilio.db.getAllRows(query.toParam());
	});
};
