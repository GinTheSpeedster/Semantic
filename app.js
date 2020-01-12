var wotServer = require('./servers/wot-server'),
    tempServer = require('./servers/httpTemp'),
    weatherServer = require('./servers/httpWeather'),
    converterServer = require('./servers/httpConverter');

wotServer();

var server = tempServer.listen(8090, function () {
    console.log('HTTP server started on port 8090...');
});

var tserver = weatherServer.listen(8080, function() {
    console.log('HTTP server started on port 8080...');
});

var cserver = converterServer.listen(8100, function(){
    console.log('HTTP server started on port 8100...')
});

// Starting an insecure (HTTP/WS) server on port 8787:
// server(8787, false);