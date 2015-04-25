exports.auth = function(req, res, next){
	if (req.isAuthenticated()) { return next(); }
	req.session.redirect_to = req.originalUrl;
  	res.redirect('/login')
};