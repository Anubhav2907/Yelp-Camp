module.exports.isLoggedIn = function(req,res,next){
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.returnto = req.originalUrl;
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next();
}