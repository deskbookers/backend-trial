"use strict";
module.exports = function ExpressModule(config) {
	var Express = require('express');
	var Swig = require('swig');
	var BodyParser = require('body-parser');

	var virgilio = this;
	var express = virgilio.namespace$('express');

	function runAndConfigureExpress(port, templateDir, staticDir) {
		var app = Express();

		app.engine('html', Swig.renderFile);
		Swig.setDefaults({ cache: false });
		app.set('view cache', false); //Swig has a built-in cache
		app.set('view engine', 'html');
		app.set('views', templateDir);

		app.use(BodyParser.urlencoded({ extended: true }));
		app.use('/static', Express.static(staticDir));

		app.listen(port);
		return app;
	}

	express.router = runAndConfigureExpress(config.express.port, config.express.templateDir, config.express.staticDir);
}