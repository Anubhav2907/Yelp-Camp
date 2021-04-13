const express = require('express')
const router = express.Router({ mergeParams : true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError')
const Review = require('../models/review')
const Campground = require('../models/campground')
const {reviewSchema} = require('../schemas.js');
const validateReview = function(req,res,next){
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
router.post('/', validateReview, catchAsync(async function(req,res){
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewid', catchAsync(async function(req,res){
    const {id, reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull : {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}))
module.exports = router;