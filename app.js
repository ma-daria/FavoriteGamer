const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();
require('./database/lib/dbInit');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const signUpRouter = require('./routes/signUp');
const signInRouter = require('./routes/signIn');
const gamerSearchRouter = require('./routes/gamerSearch');
const addFavoriteRouter = require('./routes/addFavorite');
const getFavoriteRouter = require('./routes/getFavorite');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/sign_up', signUpRouter);
app.use('/api/sign_in', signInRouter);
app.use('/api/gamer_search', gamerSearchRouter);
app.use('/api/add_favorite', addFavoriteRouter);
app.use('/api/get_favorite', getFavoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
