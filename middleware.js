const {campgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/expressError')
const Campground = require('./models/campground.js')
const Review = require('./models/review.js')


module.exports.isLoggedIn = function(req,res,next){
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.returnto = req.originalUrl;
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next();
}
module.exports.validateCampground = function(req,res,next){
    
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
module.exports.isAuthor = async function(req,res,next){
    const {id} = req.params;
    const found = await Campground.findById(id)
    if(!found.author.equals(req.user._id)){
        req.flash('error', "Sorry, you don't have permission to make changes")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
module.exports.validateReview = function(req,res,next){
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}
module.exports.reviewAuthor = async function(req,res,next){
    const {id , reviewid} = req.params;
    const review = await Review.findById(reviewid)
    if(!review.author.equals(req.user._id)){
        req.flash('error', "Sorry, you don't have permission to make changes")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
