const moment = require("moment");

module.exports = async (req, res, next) => {

  if (req.url.toString().indexOf('/source/?image=') != -1 || req.url.toString().indexOf('/favicon.ico') != -1) {
    return next(); // No error proceed to next middleware
  }
  else {

    if (req.header('license') == undefined) {
      let response = [{
        status: 'error',
        invalid_code: "-1",
        message: "License failed.",
        response_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }]

      res.status(401).send(response);
      return false;
    }
    else {
      if (req.header('license') == 'snt01' || req.header('license') == 'dev01') {
        next();
      }
      else {
        let response = [{
          status: 'error',
          invalid_code: "-1",
          message: "License failed.",
          response_time: moment().format('YYYY-MM-DD HH:mm:ss')
        }]

        res.status(401).send(response);
        return false;
      }

    }

  }

};