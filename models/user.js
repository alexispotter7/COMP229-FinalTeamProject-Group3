const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
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
    username: {
        type: String,
        required: true,
        maxlength: 255   
    },
    email: {
        type: String,
        required: true,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
})

userSchema.pre(
    'save', 
    async function(next) {
        const hash = await bcrypt.hash(this.password, 10)
    }
)

userSchema.methods.isValidPassword = async function(password) {
    const user = this
    const compare = await bcrypt.compare(password, user.password)
    return compare
}

const userModel = mongoose.model('user', userSchema)
module.exports = userModel