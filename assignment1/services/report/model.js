"use strict";
module.exports = function ReportModel(config) {
	var virgilio = this;
	var model = virgilio.namespace$('report.model');

	actions.defineAction$(function getLTVBetweenTimestamp(startTimestamp, endTimestamp) {
		getBookingsBetween(startTimestamp, endTimestamp)
			.then(function formatResult(rows) {
				console.log(rows);
				return rows;
			});
	});

	function getBookingsBetween(startTimestamp, endTimestamp) {
		return new virgilio.Promise(function getBookings(reject, resolve) {
			var query = 'SELECT * FROM (SELECT b.booker_id, count(locked_total_price) as number_of_bookings, sum(locked_total_price) as total_turnover, min(end_timestamp) as first_booking FROM bookingitems bi JOIN bookings b ON (bi.booking_id = b.id) GROUP BY b.booker_id) WHERE first_booking > $startTimestamp and first_booking < $endTimestamp';
			var params = {$startTimestamp: startTimestamp, $endTimestamp: endTimestamp};
			virgilio.db.all(query, params, function(err, rows){
				if(err) return reject(err);
				resolve(rows);
			});
		});
	}
}