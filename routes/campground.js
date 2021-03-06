const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground.js')
const { campgroundSchema, reviewSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCamp))

router.get('/new', isLoggedIn, campgrounds.getcreate)

router.route('/:id')
    .get(catchAsync(campgrounds.viewCamp))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.edit))
    .delete(isAuthor, catchAsync(campgrounds.delete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))
module.exports = router;