exports.auth = function(req, res, next){
	if (req.isAuthenticated()) { 
		res.locals.user = req.user;
		return next(); 
	}
	req.session.redirect_to = req.originalUrl;
  	res.redirect('/login')
};