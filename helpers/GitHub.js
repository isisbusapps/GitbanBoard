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

		opts.repos.forEach(function(repo, key){
			github.pullRequests.getAll(
			{
				user: process.env.ORG_NAME,
				repo: repo,
				state: opts.status || 'open'
			},
			function(err, res){
				if(err) console.log("Error: "+err);
				res.forEach(function(issue, issueKey){
					if(res.hasOwnProperty(issueKey)){
						issues.push(issue);
					}
				});
				repoDone();
			});
		});
	}
};