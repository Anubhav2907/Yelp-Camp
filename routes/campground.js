const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground.js')
const {campgroundSchema, reviewSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campground = require('../models/campground.js');

router.get('/', catchAsync(async function (req, res) {
    const camps = await Campground.find({})
    res.render('campground/campground', { camps });
}))
router.get('/new', isLoggedIn ,function (req, res) {
    res.render('campground/new');
})
router.post('/',isLoggedIn, validateCampground ,catchAsync(async function (req, res, next) {
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data");
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.get('/:id' ,catchAsync(async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(camp)
    if(!camp){
        req.flash('error', "Sorry, can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campground/show', { camp })
}))
router.get('/:id/edit', isLoggedIn,isAuthor ,catchAsync(async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', "Sorry, can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campground/edit', { camp })
}))
router.put('/:id',validateCampground,isAuthor ,catchAsync(async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully Updated campground');
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.delete('/:id',isAuthor, catchAsync(async function (req, res) {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds')
}))
module.exports = router;