'use strict';
var express = require('express');
var router = express.Router();
var github = require('../helpers/GitHub');
var auth = require('../middleware/auth').auth;

require('dotenv').load();

router.get('*', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }

    return next();
});

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/kanban', auth, function(req, res) {
    var githubUsers = [];
    var githubIssues = [];
    var standupUsers = [];
    var labels = [];
    var users = process.env.ALLOWED_USERS.split(',');

    var completed = 0;
    var toComplete = 0;
    var usersFetched = 0;

    function sortStandupUsers(a, b) {
        if (a.login > b.login) return 1;
        if (a.login === b.login) return 0;
        if (a.login < b.login) return -1;
    }

    function done() {
        if (++completed === toComplete) {

            // Order isn't guaranteed so manually sort by username
            standupUsers = standupUsers.sort(sortStandupUsers);
            res.render('kanban',
                {
                    backlog: githubIssues,
                    githubusers: githubUsers,
                    labels: labels,
                    repos: process.env.REPOS.split(','),
                    standupUsers: standupUsers
                }
            );
        }
    }

    // Fetch all users
    toComplete++;
    users.forEach(function(username) {
        github.getUser(username, function(githubUser) {
            standupUsers.push(githubUser);
            if (++usersFetched === users.length) {
                done();
            }
        });
    });

    // Fetch all issues
    toComplete++;
    function processIssue(issue) {
        if (issue.assignee && githubUsers.indexOf(issue.assignee.login) < 0) {
            githubUsers.push(issue.assignee.login);
        }

        issue.labels.forEach(function(label) {
            if (labels.indexOf(label.name) < 0) {
                labels.push(label.name);
            }
        });
    }

    github.getIssues(
        {
            repos: process.env.REPOS.split(','),
            status: 'all'
        },
        function(issues) {
            issues.forEach(processIssue);
            githubIssues = issues;
            done();
        });
});

module.exports = router;
