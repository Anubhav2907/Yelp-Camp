const express = require('express')
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync');
const passport = require('passport')
const users = require('../controllers/users')

router.get('/register', users.getRegister)
router.post('/register', catchAsync(users.register))
router.get('/login', users.getLogin)
router.get('/logout', users.logout)
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

module.exports = router;