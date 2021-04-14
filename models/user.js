const mongoose = require('mongoose');
const passportlocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    }
});
userSchema.plugin(passportlocalMongoose);
module.exports = mongoose.model('User', userSchema)