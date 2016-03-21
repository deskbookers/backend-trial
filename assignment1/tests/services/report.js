var should = require('should');
var Virgilio = require('virgilio');
var model = require('../../services/report/model.js');

describe('Report function', function ReportTest() {
	var virgilio = null;

	it('returns a proper function when required', function checkIfFunc() {
		model.should.be.a.Function();
	});

	beforeEach(function loadVirgilio() {
		var config = require('../../config');
		config.logger = { streams: [] };

		virgilio = new Virgilio(config);
		virgilio.loadModule$(model);
	});

	it('should register itself on the correct namespace', function checkNamespace() {
		virgilio.should.have.property('report');
		virgilio.report.should.have.property('model');
	});

	it('should calculate interest and averages correctly', function checkIfCorrect() {
		var testData = [
			{
				date: '2015-10',
				numberOfBookings: 1019,
				totalTurnover: 106395.55999999997,
				numberOfBookers: 353
			},
			{
				date: '2015-11',
				numberOfBookings: 282,
				totalTurnover: 34380.57,
				numberOfBookers: 65
			},
			{
				date: '2015-12',
				numberOfBookings: 45,
				totalTurnover: 73625.8,
				numberOfBookers: 10
			}];

		var expectedResult = [
			{
				date: '2015-10',
				numberOfBookings: 1019,
				totalTurnover: 106395.55999999997,
				numberOfBookers: 353,
				averageBookings: 2.8866855524079322,
				averageTurnover: 104.41173699705591,
				lifeTimeValue: 10.441173699705592
			},
			{
				date: '2015-11',
				numberOfBookings: 282,
				totalTurnover: 34380.57,
				numberOfBookers: 65,
				averageBookings: 4.338461538461538,
				averageTurnover: 121.91691489361702,
				lifeTimeValue: 12.191691489361702
			},
			{
				date: '2015-12',
				numberOfBookings: 45,
				totalTurnover: 73625.8,
				numberOfBookers: 10,
				averageBookings: 4.5,
				averageTurnover: 1636.128888888889,
				lifeTimeValue: 163.6128888888889
			}];

		var actualResult = testData.map(virgilio.report.model.calculateAvgAndInterest);
		actualResult.should.be.eql(expectedResult);
	});

	it('should convert aggregate results into array correctly', function checkIfCorrect() {
		var testData = [
			{booker_id:1, number_of_bookings: 3, total_turnover: 100, first_booking: 1458520001},
			{booker_id:2, number_of_bookings: 6, total_turnover: 200, first_booking: 1458520002},
			{booker_id:999, number_of_bookings: 11, total_turnover: 150, first_booking: 1458520022}];

		var expectedResult = { '2016-03': { numberOfBookings: 20, totalTurnover: 450, numberOfBookers: 3 } };

		virgilio.report.model.aggregateBookings(testData)
			.then(function checkIfWorkedProperly(result) {
				result.should.be.eql(expectedResult);
			});

	});
});
