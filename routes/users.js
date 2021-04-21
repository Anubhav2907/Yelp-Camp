const express = require('express')
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const users = require('../controllers/users')

router.route('/register')
    .get(users.getRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.getLogin)
    .get(users.logout)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

module.exports = router;