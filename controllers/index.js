var express = require('express'),
	router = express.Router(),
	github = require('../helpers/GitHub'),
	auth = require('../middleware/auth').auth;
	
require('dotenv').load();

router.get('*', function(req, res, next){
	if (req.isAuthenticated()) { 
		res.locals.user = req.user;
	}
	return next(); 
});

router.get('/', function(req, res){
	res.render('index');
});

router.get('/kanban', auth, function(req, res) {
	github.getIssues(
	{
		repos: process.env.REPOS.split(',')
	},
	function(issues){
  		res.render('kanban', {backlog:issues});
	}
	);
});

module.exports = router;