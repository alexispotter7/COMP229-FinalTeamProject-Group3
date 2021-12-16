const mongoose = require('mongoose')
const Schema = mongoose.Schema

const incidentSchema = new Schema({
    owner: {
        type: String,
        required: true,
        maxlength: 255
    },
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    date: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        maxlength: 255
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    priority: {
        type: String,
        required: true
    },
    narrative: {
        type: [{timestamp : {type: String}, comment : {type: String}}],
        required: true
    },
    status: {
        type: String,
        default: "1",
        maxlength: 500
    },
    createdDate:{
        type: Date
    },    
    recordNumber: {
        type: String
        
    }, 
    incidentDuration: {
        type:String,
        maxlength: 500
    },
    incidentResolution: {
        type:String,
        maxlength: 500        
    }
    
})


const incidentModel = mongoose.model('incident', incidentSchema)
module.exports = incidentModel