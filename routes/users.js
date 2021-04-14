const express = require('express')
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')

router.get('/register', function (req, res) {
    res.render('users/register')
})
router.post('/register', catchAsync(async function (req, res, next) {
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

}))
router.get('/login', function (req, res) {
    res.render('users/login')
})
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Logged out successfully');
    res.redirect('/campgrounds')
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async function (req, res) {
    req.flash('success', 'Welcome back')
    const url = req.session.returnto || '/campgrounds'
    delete req.session.returnto;
    res.redirect(url)

})
module.exports = router;