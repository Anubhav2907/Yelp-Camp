const Campground = require('../models/campground.js')
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
module.exports.index = async function (req, res) {
    const camps = await Campground.find({})
    res.render('campground/campground', { camps });
}
module.exports.getcreate = function (req, res) {
    res.render('campground/new');
}
module.exports.createCamp = async function (req, res, next) {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()    
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
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
    console.log(camp)
    if (!camp) {
        req.flash('error', "Sorry, can't find that campground")
        res.redirect('/campgrounds')
    }
    console.log(camp.geometry.coordinates)
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
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...imgs)
    await camp.save();
    if (req.body.deleteImages) {
        for (let file of req.body.deleteImages) {
            cloudinary.uploader.destroy(file);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    // await camp.save();
    req.flash('success', 'Successfully Updated campground');
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.delete = async function (req, res) {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground');
    res.redirect('/campgrounds')
}