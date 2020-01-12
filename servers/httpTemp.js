var express = require('express'),
  routesCreator = require('../routes/routesCreatorTemp'),
  converter = require('../middleware/converterTemp'),
  cons = require('consolidate');

var app = express();


// Create Routes
app.use('/', routesCreator.create());

// Templating engine html
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');

app.use(converter());

module.exports = app;