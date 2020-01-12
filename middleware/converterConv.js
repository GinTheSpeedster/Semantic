module.exports = function () {
    return function (req, res, next) {
        if (req.model) {
            res.render('semanticOpenApiTemplate', {req: req});
            return;
        }
        else if(req.obj){
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(req.obj));
        }

        else if (res.location) {
            res.status(204).send();
            return;
        }// else {
          //  next();
        //}
    }
};