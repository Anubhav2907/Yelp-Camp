const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground.js')
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.get('/', catchAsync(campgrounds.index))
router.get('/new', isLoggedIn, campgrounds.getcreate)
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCamp))
router.get('/:id', catchAsync(campgrounds.viewCamp))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))
router.put('/:id', validateCampground, isAuthor, catchAsync(campgrounds.edit))
router.delete('/:id', isAuthor, catchAsync(campgrounds.delete))
module.exports = router;