var express = require('express'),
    http = require('http'),
    model = require('./../resources/weatherConf'),
    cons = require('consolidate');
const util = require('util');

var app = express();

// Templating engine json
app.engine('json', cons.handlebars);
app.set('view engine', 'json');
app.set('views', __dirname + '/../views');

var temp_ld = {
    "name": "Temperature",
    "description": "The temperature of the city in Celsius",
    "unitCode": "CEL"
};

const options = {
    host: 'api.openweathermap.org',
    port: '80',
    path: '/data/2.5/weather?q=Milan&APPID=2a3067fbb25e276740b04afcb0aa904a&units=metric',
    headers: {
        'user-agent': 'node.js'
    }
};

var count = 0;

app.get('/', function(req, res){
    count++;
    console.log('Count: ' + count);
    if(count == 1) {
        /*
        http.get(options, function (response) {
            var result = '';
            response.on('data', function (chunk) {
                result += chunk;
            });

            response.on('end', function () {
                var obj = JSON.parse(result);
                temp_ld.value = obj.main.temp;*/
                temp_ld.value = 10;
                if (req.accepts('application/json')) {
                    res.setHeader('Content-Type', 'application/ld+json');
                    res.end(JSON.stringify(temp_ld));
                }
                else {
                    req.model = model;
                    res.render('semanticOpenApiTemplate.json', {req: req});
                }/*
            });
        }).on('error', function (err) {
            console.log("Error: " + err.message);
        });*/
    }
    else if(count == 10){
        count = 0;
        if (req.accepts('application/json')) {
            res.setHeader('Content-Type', 'application/ld+json');
            res.end(JSON.stringify(temp_ld));
        }
        else {
            req.model = model;
            res.render('semanticOpenApiTemplate.json', {req: req});
            console.log('Reset count');
        }
    }
    else{
        if (req.accepts('application/json')) {
            res.setHeader('Content-Type', 'application/ld+json');
            res.end(JSON.stringify(temp_ld));

        }
        else {
            req.model = model;
            res.render('semanticOpenApiTemplate.json', {req: req});
            console.log('Response without get');
        }
    }
});


module.exports = app;