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
		repos: process.env.REPOS.split(','),
		status: 'all'
	},
	function(issues){
		var githubusers = [],
			labels = [];
		issues.forEach(function(issue){
			if(githubusers.indexOf(issue.user.login) < 0){
				githubusers.push(issue.user.login);
			}
			issue.labels.forEach(function(label){
				if(labels.indexOf(label.name) < 0){
					labels.push(label.name);
				}	;
			});
		});
  		res.render('kanban', 
  			{
  				backlog:issues,
  				githubusers: githubusers,
  				labels: labels,
  				repos: process.env.REPOS.split(',') 
  			}
		);
	}
	);
});

module.exports = router;