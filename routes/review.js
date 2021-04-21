const express = require('express')
const router = express.Router({ mergeParams : true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError')
const Review = require('../models/review')
const Campground = require('../models/campground')
const {reviewSchema} = require('../schemas.js');
const {validateReview, isLoggedIn, reviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn ,validateReview, catchAsync(reviews.addReview))

router.delete('/:reviewid',isLoggedIn,reviewAuthor,catchAsync(reviews.deleteReview))
module.exports = router;