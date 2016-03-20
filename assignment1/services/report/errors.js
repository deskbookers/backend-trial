'use strict';
module.exports = function ReportErrors() {
	var virgilio = this;
	var error = virgilio.namespace$('report.error');

	error.registerError$(function noBookingsFoundError() {
		this.message = 'No bookings found.';
		this.displayable = true;
	});

	error.filterDisplayableError = function filterDisplayableError(err) {
		return err.displayable || false;
	};
};
