var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var bodyParser = require('body-parser');

var app = express();
var partials = require('express-partials');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


app.use(partials());

var movieController = require('./routes/movie_controller.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// Routes
app.get('/movies', movieController.index);
app.get('/movies/new', movieController.new);
app.get('/movies/:movieid([0-9]+)', movieController.show);
app.post('/movies', movieController.create);
app.get('/movies/:movieid([0-9]+)/edit', movieController.edit);
app.put('/movies/:movieid([0-9]+)', movieController.update);
app.delete('/movies/:movieid([0-9]+)', movieController.destroy);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.escapeText = function(text) {
return String(text)
.replace(/&(?!\w+;)/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/\n/g, '<br>');
};

module.exports = app;
