"use strict";
module.exports = function ReportActions(config) {
	var virgilio = this;
	var actions = virgilio.namespace$('report.actions');
	var moment = require('moment');

	actions.defineAction$(function generateLTVForDuration(duration) {
		var now = moment().unix();
		var startDate = moment().subtract(duration, 'months').unix();

		return actions.model.getLTVBetweenTimestamp(startDate, now)
			.then(roundToDecimalPlaces);
	});

	function roundToDecimalPlaces(ltvReports) {
		return ltvReports.map(function convertDecimalPlaces(report){
			report.lifeTimeValue = report.lifeTimeValue.toFixed(2);
			report.averageTurnover = report.averageTurnover.toFixed(2);
			report.averageBookings = report.averageBookings.toFixed(2);
			return report;
		});
	}
}