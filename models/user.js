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
    },
    admin: {
        type: Boolean,
        default: false        
    }
})


// create new User document
userSchema.statics.create = function(username, password, firstName, lastName, email, admin) {
    // encrypt the password
    const encrypted = crypto.createHmac('sha1', config.pwSecret)
                      .update(password)
                      .digest('base64')
    const user = new this({
        username, 
        password: encrypted, 
        firstName, 
        lastName, 
        email,
        admin
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



// update the document of the user who is signned in and trying to modify the user Info
// updateOne() instead of update()
userSchema.statics.updateOne = function(user, firstName, lastName, email, admin) {          
           
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.admin = admin;

    // User's new profile is updated to the database
    return user.save()
}


const userModel = mongoose.model('user', userSchema)
module.exports = userModel