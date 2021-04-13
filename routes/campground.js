const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError')
const Campground = require('../models/campground.js')
const {campgroundSchema, reviewSchema} = require('../schemas.js');

const validateCampground = function(req,res,next){
    
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
router.get('/', catchAsync(async function (req, res) {
    const camps = await Campground.find({})
    res.render('campground/campground', { camps });
}))
router.get('/new', function (req, res) {
    res.render('campground/new');
})
router.post('/', validateCampground ,catchAsync(async function (req, res, next) {
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data");
    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.get('/:id', catchAsync(async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error', "Sorry, can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campground/show', { camp })
}))
router.get('/:id/edit', catchAsync(async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', "Sorry, can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campground/edit', { camp })
}))
router.put('/:id',validateCampground ,catchAsync(async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully Updated campground');
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.delete('/:id', catchAsync(async function (req, res) {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds')
}))
module.exports = router;