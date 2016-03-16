'use strict';
module.exports = function ReportActions() {
	var virgilio = this;
	var actions = virgilio.namespace$('report.actions');
	var moment = require('moment');

	actions.defineAction$(function generateLTVForDuration(duration) {
		var now = moment().unix();
		var startDate = moment().subtract(duration, 'months').unix();

		actions.log$.info('Requesting an LTV report for timerange:', startDate, now, 
			'which cover the duration of', duration, 'months.');

		return actions.model.getLTVBetweenTimestamp(startDate, now)
			.then(roundToDecimalPlaces);
	});

	function roundToDecimalPlaces(ltvReports) {
		return ltvReports.map(function convertDecimalPlaces(report) {
			report.lifeTimeValue = report.lifeTimeValue.toFixed(2);
			report.averageTurnover = report.averageTurnover.toFixed(2);
			report.averageBookings = report.averageBookings.toFixed(2);
			return report;
		});
	};
}
