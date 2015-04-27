'use strict';
var express = require('express');
var app = express();
var expressHbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var moment = require('moment');

require('dotenv').load();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'dshbrts w;kjregvrejk',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy(
{
    clientID: process.env.GH_KEY,
    clientSecret: process.env.GH_SECRET,
    callbackURL: '/auth/github/callback',
    scope: 'repo'
},
function(accessToken, refreshToken, profile, done) {
        // Make sure user is allowed
        if (process.env.ALLOWED_USERS.split(',').indexOf(profile.username) >= 0) {
            return done(null, profile);
        } else {
            return done('Invalid user');
        }
    }
    ));
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.engine('handlebars', expressHbs.create({
    defaultLayout:'main',
    helpers: {
        formatDate: function(date) {
            return moment(date).format('ddd DD-MM-YY');
        },
        firebaseurl: function() { return process.env.FIRE_URL; },
        is: function(a, b) { return a === b; }
    }
}).engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));
app.use(require('./controllers/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            status: err.status || 500,
            message: err.message,
            error: err
        });
    });
}

// production error handler no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        status: err.status || 500,
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT, function() {
    console.log('Listening on port ' + process.env.PORT + '...');
});
