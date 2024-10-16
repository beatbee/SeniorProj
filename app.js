const express = require('express');
//const restrictMiddleware = require("./middleware/restrict");
const createError = require('http-errors');
const logger = require('morgan');
const cors = require('cors');
const app = express();
// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const locationRouter = require('./routes/user_location/route');

var compression = require('compression');
app.use(compression());
//route
app.use('/location', locationRouter);
//app.use(restrictMiddleware)
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;