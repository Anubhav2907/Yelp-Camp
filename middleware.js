module.exports.isLoggedIn = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next();
}