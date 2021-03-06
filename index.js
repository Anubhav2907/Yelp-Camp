if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const Campground = require('./models/campground.js')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError')
const joi = require('joi')
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const { func } = require('joi');
const Review = require('./models/review')
const camproutes = require('./routes/campground')
const reviewroutes = require('./routes/review')
const userroutes = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const passport = require('passport')
const localstrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const MongoDBStore = require('connect-mongo')(session);
const databaseURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const secret = process.env.SECRET || 'secret';
mongoose.connect(databaseURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, })
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'))
db.once("open", function () {
    console.log('Database Connected');
})
const store = new MongoDBStore({
    url: databaseURL,
    secret,
    touchAfter: 24*60*60
});
store.on('error', function(e){
    console.log("OH NO!!! ERROR", e)
})
const sessionconfig = {
    store,
    name : 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionconfig))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session())
app.use(mongoSanitize());
app.use(helmet({
    contentSecurityPolicy:false
}))
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/campgrounds',camproutes)
app.use('/campgrounds/:id/reviews',reviewroutes )
app.use('/', userroutes)

app.get('/', function (req, res) {
    res.render('home');
})
app.all('*', function(req,res,next){
    next(new ExpressError('Page not found!!!', 404))
})
app.use(function (err, req, res, next) {
    const { statusCode=500} = err;
    if(!err.message) err.message ='Something went wrong'
    res.status(statusCode).render('error', {err})
})
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`On port ${port}`)
})