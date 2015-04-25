var express = require('express'),
 	app = express(),
 	expressHbs = require('express-handlebars'),
 	moment = require('moment');
require('dotenv').load();

var hbs = expressHbs.create({
    defaultLayout:'main',
    helpers: {
        formatDate: function (date) { return moment(date).format('ddd DD-MM-YY'); },
        firebaseurl: function () { return process.env.FIRE_URL; }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));

app.listen(process.env.PORT, function() {
  console.log('Listening on port '+process.env.PORT+'...');
});