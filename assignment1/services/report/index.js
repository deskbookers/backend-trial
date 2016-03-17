'use strict';
var tv4 = require('tv4');
var reportSchema = require('./schemas/report.json');

module.exports = function ReportingModule() {
	var virgilio = this;
	var report = virgilio.namespace$('report');
	
	virgilio.loadModule$(require('./actions'));
	virgilio.loadModule$(require('./model'));

	virgilio.express.router.get('/', function handleRequest(req, res) {
		res.render('index', {});
	});

	virgilio.express.router.post('/report', function handleRequest(req, res) {
		/*
			note: if there would be more requests i would create
			a middleware generator with the reveal module pattern
			in order to use like this:
			var validator = virgilio.helpers.createValidationModule(reportSchema); //returns a middleware
			virgilio.express.router.post('/report', validator , function handleReq(req, res) {});
		*/
		if (!tv4.validate(req.body, reportSchema)) {
			return res.render('index', 
				{ error: 'Validation failed, duration must be a positive whole number.' });
		}

		var duration = parseInt(req.body.duration);
		report.actions.generateLTVForDuration(duration)
			.then(function showResult(result) {
				res.render('result', { ltvReports: result });
			})
			.catch(function handleErr(err) {
				report.log$.error('error while rendering results:', err);
				res.render('index', { error: err.title });
			});
	});
};
