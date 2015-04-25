var express = require('express'),
	router = express.Router(),
	github = require('../helpers/GitHub');

router.get('/', function(req, res) {
	github.getIssues(
	{
		repos: ['jsoxford.github.com']
	},
	function(issues){
  		res.render('kanban', {backlog:issues,todo:[],inprogress:[],done:[]});
	}
	);
});

module.exports = router;