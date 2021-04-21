const User = require('../models/user')

module.exports.getRegister = function (req, res) {
    res.render('users/register')
}

module.exports.register = async function (req, res, next) {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, function (err) {
            if (err) return next(err);
            req.flash('success', 'Welcome to yelp camp')
            res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}
module.exports.getLogin = function (req, res) {
    res.render('users/login')
}
module.exports.logout = function (req, res) {
    req.logout();
    req.flash('success', 'Logged out successfully');
    res.redirect('/campgrounds')
}
module.exports.login = async function (req, res) {
    req.flash('success', 'Welcome back')
    const url = req.session.returnto || '/campgrounds'
    delete req.session.returnto;
    res.redirect(url)
}
