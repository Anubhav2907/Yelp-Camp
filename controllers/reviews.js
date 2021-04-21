const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.addReview = async function(req,res){
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.deleteReview = async function(req,res){
    const {id, reviewid} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull : {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid)
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}