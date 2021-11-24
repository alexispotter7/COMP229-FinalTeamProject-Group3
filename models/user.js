const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const config = require('../config')

const userSchema = new Schema({    
    username: {
        type: String,
        required: true,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 255
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 255
    },        
    email: {
        type: String,
        required: true,
        maxlength: 255
    }
})


// create new User document
userSchema.statics.create = function(username, password, firstName, lastName, email) {
    // encrypt the password
    const encrypted = crypto.createHmac('sha1', config.pwSecret)
                      .update(password)
                      .digest('base64')
    const user = new this({
        username, 
        password: encrypted, 
        firstName, 
        lastName, 
        email
    })

    // a new user document is saved to the database
    return user.save()
}


// for password verification
userSchema.methods.verify = function (password) {
    const encrypted = crypto.createHmac('sha1', config.pwSecret)
                      .update(password)
                      .digest('base64')
    console.log("inputPassword: " + password);
    console.log("hash inputPassword: " + encrypted);
    console.log("db user Password: " + this.password);
    return this.password === encrypted;
};

// finds a user document in the database by using username 
userSchema.statics.findOneByUsername = function(username) {
    return this.findOne({
        username
    }).exec()
}


userSchema.set('toJSON', { // ?
    getters: true,
    virtuals: true
});


const userModel = mongoose.model('user', userSchema)
module.exports = userModel