'use strict';
module.exports = function ReportActions() {
	var virgilio = this;
	var actions = virgilio.namespace$('report.actions');
	var moment = require('moment');

	actions.defineAction$(function generateLTVForDuration(duration) {
		var startTimestamp = moment().subtract(duration, 'months').unix();
		var endTimestamp = moment().unix();

		actions.log$.info('Requesting an LTV report for timerange:', startTimestamp, endTimestamp,
			'which cover the duration of', duration, 'months.');

		return actions.model.getBookingsBetween(startTimestamp, endTimestamp)
			.tap(function checkIfResultIsNotEmpty(result) {
				if (!result.length) throw new virgilio.report.error.noBookingsFoundError();
			})
			.then(actions.model.aggregateBookings)
			.then(actions.model.convertToArray)
			.map(actions.model.calculateAvgAndInterest)
			.tap(function(a){console.log(a)})
			.map(roundToTwoDecimalPlaces);
	});

	function roundToTwoDecimalPlaces(report) {
		report.lifeTimeValue = report.lifeTimeValue.toFixed(2);
		report.averageTurnover = report.averageTurnover.toFixed(2);
		report.averageBookings = report.averageBookings.toFixed(2);
		return report;
	};
}
