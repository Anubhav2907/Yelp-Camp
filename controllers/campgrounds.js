const Campground = require('../models/campground.js')


module.exports.index = async function (req, res) {
    const camps = await Campground.find({})
    res.render('campground/campground', { camps });
}
module.exports.getcreate = function (req, res) {
    res.render('campground/new');
}
module.exports.createCamp = async function (req, res, next) {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'Successfully created a new campground');
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.viewCamp = async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(camp)
    if (!camp) {
        req.flash('error', "Sorry, can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campground/show', { camp })
}
module.exports.editForm = async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', "Sorry, can't find that campground")
        res.redirect('/campgrounds')
    }
    res.render('campground/edit', { camp })
}
module.exports.edit = async function (req, res) {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully Updated campground');
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.delete = async function (req, res) {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds')
}