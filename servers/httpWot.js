var express = require('express'),
  routesCreator = require('../routes/routesCreatorWot'),
  resources = require('./../resources/model'),
  converter = require('../middleware/converterWot'),
  reqHandler = require('../handler/postHandler'),
  auth = require('./../middleware/auth'),
  keys = require('../resources/auth'),
  bodyParser = require('body-parser'),
  cons = require('consolidate'),
  utils = require('./../utils/utils'),
  cors = require('cors');

var app = express();

app.use(bodyParser.json());
app.use(cors());

// Enables API Auth
// Use this to generate a new API token:
// console.info('Here is a new random crypto-secure API Key: ' + utils.generateApiToken());
if(resources.customFields.secure === true) {
  console.info('My API Token is: ' + keys.apiToken);
  app.use(auth()); // uncomment to enable the auth middleware
}


// Create Routes
app.use('/', routesCreator.create(resources));

app.use(reqHandler.handle(resources));

// Templating engine json
app.engine('json', cons.handlebars);
app.set('view engine', 'json');
app.set('views', __dirname + '/../views');

// Templating engine html
app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/../views');
// Sets the public folder (for static content such as .css files & co)
app.use(express.static(__dirname + '/../public'));


app.use(converter());

module.exports = app;