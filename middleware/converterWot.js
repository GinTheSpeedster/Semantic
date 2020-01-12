var msgpack = require('msgpack5')(),
  encode = msgpack.encode;

module.exports = function () {
  return function (req, res, next) {
    if (req.result) {

      req.rooturl = req.headers.host;
      req.qp = req._parsedUrl.search;

      if (req.accepts('html')) {

        var helpers = {
          json: function (object) {
            return JSON.stringify(object);
          },
          getById: function (object, id) {
            return object[id];
          }
        };

        // Check if there's a custom renderer for this media type and resource
        if (req.type) res.render(req.type, {req: req, helpers: helpers});
        else res.render('default', {req: req, helpers: helpers});

        return;
      }

      if (req.accepts('application/x-msgpack')) {
        console.info('MessagePack representation selected!');
        res.type('application/x-msgpack');
        res.send(encode(req.result));
        return;
      }

      if (req.accepts('application/ld+json')) {
        console.info('JSON-ld representation selected!');

		// Check if there's a custom renderer for this media type and resource
        //if (req.typeld) res.render(req.typeld, {req: req});
        //else res.render('piJsonLd.json', {req: req});
        /*else*/ res.render('semanticOpenApiTemplate.json', {req: req});

        return;
      }

      console.info('Defaulting to JSON representation!');

      var helpers = {
        ifcond: function(v1, operator, v2, options) {
          switch (operator) {
            case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '!=':
              return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
              return options.inverse(this);
          }
        }
      };

      if(req.typeJson) res.render(req.typeJson, {req: req, helpers: helpers});
      else if(req.typeld) res.render(req.typeld, {req: req});
      else res.send(req.result);

      return;

    }
    else if (res.code){
      if(res.code == "created")
        res.status(201).send();
      else
        res.status(400).send();
    }
    else if (res.location) {
      res.status(204).send();
      return;
    } else {
      next();
    }
  }
};

