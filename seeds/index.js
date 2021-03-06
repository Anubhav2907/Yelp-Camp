const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedhelper')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'Connection error:'))
db.once("open", function () {
    console.log('Database Connected');
})
const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async function () {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '608013b06739c038048ce151',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
                type: "Point"
            },
            images: {
                url: 'https://res.cloudinary.com/dlidkqqhr/image/upload/v1619042389/Yelp-camp/iq7ndpxhqj67cta4d4zy.jpg',
                filename: 'Yelp-camp/iq7ndpxhqj67cta4d4zy'
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})