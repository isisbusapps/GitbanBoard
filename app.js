var express = require('express'),
 	app = express(),
 	expressHbs = require('express-handlebars');
require('dotenv').load();

app.engine('handlebars', expressHbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(require('./controllers'));

app.listen(process.env.PORT, function() {
  console.log('Listening on port '+process.env.PORT+'...');
});