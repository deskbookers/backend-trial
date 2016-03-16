"use strict";
var tv4 = require('tv4');
var reportSchema = require('./schemas/report.json');
module.exports = function ReportingModule(config) {
	var virgilio = this;
	var report = virgilio.namespace$('report');
	virgilio.loadModule$(require('./actions'));
	virgilio.loadModule$(require('./model'));

	virgilio.express.router.get('/', function handleRequest(req, res) {
		res.render('index', {});
	});

	virgilio.express.router.post('/report', function handleRequest(req, res) {
		if(req.body && req.body.duration) req.body.duration = parseInt(req.body.duration);
		if(!tv4.validate(req.body, reportSchema)) {
			return res.render('index', {error:'Validation failed, duration must be a positive whole number.'});
		}

		report.actions.generateLTVForDuration(req.body.duration)
			.then(function showResult(result) {
				res.render('result', {ltvReports:result});
			})
			.catch(function handleErr(err) {
				report.log$.error('error while rendering results:', err);
				res.render('index', {error: err.title});
			});
	});
}