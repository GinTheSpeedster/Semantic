var express = require('express'),
    router = express.Router(),
    https = require('https'),
    model = require('./../resources/converterConf');

const options = {
    host: 'congen-temperature-converter-v1.p.rapidapi.com',
    path: '/convert',
    port: '443',
    headers: {
        accept: 'application/json',
        'X-RapidAPI-Key': 'ae3d9bb732msh86d4edfb7bdbe9fp19bd4bjsne80b84c1d7d2'
    }
};

exports.create = function () {

    // Create the routes
    createRootRoute();

    return router;
};

function createRootRoute() {
    router.route('/').get(function (req, res, next) {
        req.model = model;
        next();
    });

    router.route('/temperature/:from/:to/:value').get(function(req,res,next){
        confrontation(req.params.from, function(from){
            confrontation(req.params.to, function(to){
                options.path += '?from=' + from;
                options.path += '&to=' + to;
                options.path += '&value=' + req.params.value;
                options.path += '&decimal=' + 2;
                full_get(options, function(object){
                    req.obj = object;
                    next();
                });
            });
        });
    });
}

function full_get(options, callback){
    https.get(options, function(response){
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

function confrontation (value, callback){
    if(value.toUpperCase() == 'CEL' || value.toUpperCase() == 'CELSIUS' || value.toUpperCase() == 'C')
        callback('celsius');
    else if(value.toUpperCase() == 'KEL' || value.toUpperCase() == 'KELVIN' || value.toUpperCase() == 'K')
        callback('kelvin');
    else if(value.toUpperCase() == 'FAR' || value.toUpperCase() == 'FAHRENHEIT' || value.toUpperCase() == 'F')
        callback('fahrenheit');
    else
        callback('Unknown value');
}