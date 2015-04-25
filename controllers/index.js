var express = require('express'),
	router = express.Router(),
	github = require('../helpers/GitHub');
require('dotenv').load();

router.get('/', function(req, res) {
	github.getIssues(
	{
		repos: process.env.REPOS.split(',')
	},
	function(issues){
  		res.render('kanban', {backlog:issues,todo:[],inprogress:[],done:[]});
	}
	);
});

module.exports = router;