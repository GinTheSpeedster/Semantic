var express = require('express'),
  router = express.Router();
const jsonld = require('jsonld');
var http = require('http');

const options = {
	host: 'localhost',
	port: '8080',
	headers: {
		accept: 'application/ld+json'
	}
}

const options2 = {
	host: 'localhost',
	port: 8484,
	headers: {
		accept: 'application/ld+json'
	}
}

const options3 = {
	host: 'localhost',
	port: 8100,
	headers: {
		accept: 'application/ld+json'
	}
}



exports.create = function () {

  // Create the routes
  createRootRoute();

  return router;
};

const value = 'http://schema.org/value';
const unit = 'http://schema.org/unitCode';
const temperature = 'http://dbpedia.org/page/Temperature';
const converter = 'http://dbpedia.org/page/Conversion_of_units';
const actualValue = '@value';

function createRootRoute() {
	router.route('/').get(function (req, res, next) {
		full_get(options2, function(obj_wot){
			full_get(options,function(obj_weather){
				get_object(obj_wot, temperature, function(json_wot){
					get_object(obj_weather, temperature, function(json_weather){
						if (json_wot.unitCode != json_weather.unitCode){
							full_get(options3, function(obj_converter){
								get_object(obj_converter, converter, function(json_converter){
									req.val_wot = json_converter.data.resultRaw;
									req.unit_wot = json_weather.unitCode;
									req.val_weather = json_weather.value;
									req.unit_weather = json_weather.unitCode;
									req.difference = Math.abs(req.val_wot - req.val_weather);
									next();
								},[json_wot.unitCode, json_weather.unitCode, json_wot.value]);
							});
						}
						else {
							req.val_wot = json_wot.value;
							req.unit_wot = json_wot.unitCode;
							req.val_weather = json_weather.value;
							req.unit_weather = json_weather.unitCode;
							req.difference = Math.abs(req.val_wot - req.val_weather);
							next();
						}
					});
				});
			});
		});
	});
};


function get_object(obj, target, callback, params = "nothing"){
	var json_weather = {};
	json_weather["@context"] = obj["@context"];
	json_weather["dbpr:path"] = {};
	counter = 0;
	for (var field in obj["dbpr:path"]) {
		json_weather["dbpr:path"]["sch:" + counter] = obj["dbpr:path"][field]["dbp:GET_(HTTP)"];
		counter ++;
	}
	jsonld.expand(json_weather, function (err, expanded_weather) {
		var found = false;
		var counter1 = 0;
		for (var field in expanded_weather[0]["http://dbpedia.org/property/path"][0]) {
			var temp = expanded_weather[0]["http://dbpedia.org/property/path"][0][field][0]["http://schema.org/valueName"];
			if (temp && temp[0]["@value"] == target) {
				found = true;
				var weather_keys = Object.keys(obj["dbpr:path"]);
				var url_weather = obj["dbp:Web_server"][0]["sch:url"] + weather_keys[field.substr(18)];
				if (expanded_weather[0]["http://dbpedia.org/property/path"][0][field][0]["http://dbpedia.org/page/Parameter_(computer_programming)"]) {
					var param = expanded_weather[0]["http://dbpedia.org/property/path"][0][field][0]["http://dbpedia.org/page/Parameter_(computer_programming)"];
					var iterations = param.length;
					var semaphore = false;
					for (var item in param) {
						if (param[item]["http://schema.org/valueRequired"]) {
							url_weather += "/" + params[item];
						}
						if (!--iterations)
							semaphore = true;
					}
					if (semaphore == true) {
						http.get(url_weather, {headers: {'accept': 'application/json'}}, function (resp) {
							var data = '';

							resp.on('data', function (chunk) {
								data += chunk;
							});

							resp.on('end', function () {
								var finaljson = JSON.parse(data);
								callback(finaljson);
							});
						});
					}
				}
				else{
					http.get(url_weather, {headers: {'accept': 'application/json'}}, function (resp) {
						var data = '';

						resp.on('data', function (chunk) {
							data += chunk;
						});

						resp.on('end', function () {
							var finaljson = JSON.parse(data);
							callback(finaljson);
						});
					});
				}
			}
			counter1++;
		}
		if (!found) {
			callback(expanded_weather);
		}
	});
}

function full_get(options, callback){
	http.get(options, function(response){
		var result='';

		response.on('data', function(chunk){
			result += chunk;
		});

		response.on('end', function() {
			var obj = JSON.parse(result);
			callback(obj);
		});
	}).on('error', function(err){
		console.log("Error: " + err.message);
	});
}