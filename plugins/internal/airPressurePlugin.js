var CorePlugin = require('./../corePlugin').CorePlugin,
	util = require('util'),
	utils = require('./../../utils/utils.js');
	
var model;
	
var AirPressurePlugin = exports.AirPressurePlugin = function(params){
	CorePlugin.call(this, params, 'airpressure', stop, simulate);
	model = this.model;
	model.semanticName = 'Atmospheric_pressure';
	model.values.a.unitCode = 'A97'
	this.addValue('950');
};
util.inherits(AirPressurePlugin, CorePlugin);

function stop(){
	throw new Error('No real hardware connected...');
};

function simulate(){
	var random_number = Math.floor(Math.random() * (1101-800+1) + 800);
	this.addValue(random_number);
};

AirPressurePlugin.prototype.createValue = function(data){
	return {a: data, "timestamp": utils.isoTimestamp()};
};