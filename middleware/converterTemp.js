module.exports = function () {
  return function (req, res, next) {
    if (req.difference) {
		res.render('defaultTemp', {req: req});
        return;
      }

    else if (res.location) {
      res.status(204).send();
      return;
    } else {
      next();
    }
  }
};
