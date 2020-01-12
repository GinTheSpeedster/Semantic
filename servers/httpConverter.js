var express = require('express'),
    routesCreator = require('../routes/routesCreatorConverter'),
    converter = require('../middleware/converterConv'),
    cons = require('consolidate');

var app = express();


// Create Routes
app.use('/', routesCreator.create());

// Templating engine json
app.engine('json', cons.handlebars);
app.set('view engine', 'json');
app.set('views', __dirname + '/../views');

app.use(converter());

module.exports = app;