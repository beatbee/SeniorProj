const express = require('express');
//const restrictMiddleware = require("./middleware/restrict");
const createError = require('http-errors');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
var compression = require('compression');
app.use(compression());
const authenticateToken = require('./middleware/authenticateToken');
const locationRouter = require('./routes/user_location/route');
const authRouter = require('./routes/auth/route');
//route
app.use('/location', locationRouter);
app.use('/auth', authRouter);
//app.use(restrictMiddleware)
app.get('/', (req, res) => {
    res.send('Hello World');
});
//authentication
app.get('/protected-route', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;