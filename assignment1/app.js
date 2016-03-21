"use strict";
var fs = require('fs');
var path = require('path');
var Virgilio = require('virgilio');
var virgilio = new Virgilio(require('./config'));

var directoriesToLoad = ['connectors', 'services'];

directoriesToLoad.forEach(function loadModulesInDir(dirname) {
    var moduleDirectory = path.join(__dirname, dirname);
    var moduleNames = fs.readdirSync(moduleDirectory);
    moduleNames.forEach(function loadModule(moduleName) {
        if (moduleName[0] === '.') {
            //Skip hidden files.
            return;
        }

        var modulePath = path.join(moduleDirectory, moduleName);
        var module = require(modulePath);
        virgilio.loadModule$(module);
    });
});