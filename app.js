const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require("express-fileupload")

const connectDB = require("./db/connection");
require("dotenv").config();
const session = require("express-session");

const studentRouter = require('./routes/students');
const touristRouter = require('./routes/tourists');
const adminRouter = require('./routes/admin');
const jobSeekerRouter = require('./routes/job-seeksers');
const { createAdmin } = require('./middleware/createAdmin');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(fileUpload())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 } //max age 1 hour
}))

async function connect() {
  try {
    let url = process.env.MONGO_URI; //connection string from .env file
    await connectDB(url);
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
}
connect();

app.use('/', studentRouter);
app.use('/tourist', touristRouter);
app.use('/admin', createAdmin, adminRouter);
app.use('/job-seeker', jobSeekerRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
