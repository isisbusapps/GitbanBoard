require('dotenv').load();
var GitHubApi = require("github");

var github = new GitHubApi({
    version: "3.0.0",
    debug: false,
    protocol: "https",
    headers: {
        "user-agent": "Gitban-Board"
    }
});
github.authenticate({
    type: "oauth",
    key: process.env.GH_KEY,
    secret: process.env.GH_SECRET
});

module.exports = {
	getIssues : function(opts, callback){
		var count = 0, 
			issues = [],
			total;

		if(typeof opts.repos === 'string'){
			opts.repos = [opts.repos];
		}
		total = opts.repos.length;
		
		function repoDone(){
			if(++count === total){
				callback(issues);
			}
		}

		function getFromGithub(repo, page){
			page = page || 1;
			github.issues.repoIssues(
			{
				user: process.env.ORG_NAME,
				repo: repo,
				state: opts.status || 'open',
				per_page: 100,
				page: page
			},
			function(err, res){
				if(err) console.log("Error: "+err);
				if(!res.length) return repoDone();
				res.forEach(function(issue, issueKey){
					if(res.hasOwnProperty(issueKey) && !issue.pull_request){
						issue.reponame = repo;
						issues.push(issue);
					}
				});
				getFromGithub(repo, ++page);
			});
		}

		opts.repos.forEach(function(repo, key){
			getFromGithub(repo);
		});
	}
};