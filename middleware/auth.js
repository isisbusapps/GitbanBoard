'use strict';
exports.auth = function(req, res, next){
    if (req.isAuthenticated()) { return next(); }
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login');
};