const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground.js')
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp))

router.get('/new', isLoggedIn, campgrounds.getcreate)

router.route('/:id')
    .get(catchAsync(campgrounds.viewCamp))
    .put(validateCampground, isAuthor, catchAsync(campgrounds.edit))
    .delete(isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))
module.exports = router;