const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground.js')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true,useCreateIndex:true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on("error",console.error.bind(console,'Connection error:'))
db.once("open", function(){
    console.log('Database Connected');
})
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.get('/makecamp',async function(req, res){
    const camp = new Campground({
        title:'Backyard',
        price: '$20',
        description: 'Full of Greenery',
        location: 'Bacak of city Hospital'
    })
    await camp.save();
    res.send(camp)
})
app.get('/', function(req,res){
    res.render('home');
})
app.get('/campgrounds', async function(req,res){
    const camps = await Campground.find({})
    res.render('campground/campground',{camps});
})
app.get('/campgrounds/new', function(req,res){
    res.render('campground/new');
})
app.post('/campgrounds', async function(req,res){
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
})
app.get('/campgrounds/:id', async function(req,res){
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/show', {camp})
})
app.get('/campgrounds/:id/edit', async function(req,res){
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/edit', {camp})
})
app.put('/campgrounds/:id',async function(req,res){
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${camp._id}`)
})
app.delete('/campgrounds/:id', async function(req,res){
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})
app.listen(3000, function(){
    console.log('On port 3000!!!')
})