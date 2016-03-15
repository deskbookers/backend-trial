"use strict";
module.exports = function ReportActions(config) {
	var virgilio = this;
	var actions = virgilio.namespace$('report.actions');
	var moment = require('moment');

	actions.defineAction$(function generateLTVForDuration(duration) {
		var now = moment().unix();
		var startDate = moment().substract(duration, 'months').unix();

		return actions.model.getLTVBetween(startDate, now);
	});
}