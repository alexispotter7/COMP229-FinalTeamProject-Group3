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
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "NEW",
        maxlength: 500
    },
    createdDate:{
        type: Date
    },    
    recordNumber: {
        type: String,
        required: true
    }, 
    incidentDuration: {
        type:String
    }
    
})

// data = {
//     description: String,
//     priority: String,
//     customerInformation: String,
//     narrative: String,
//     record: String,
//     status: {
//         default: true
//     }
// }

// data = {
//     description: String,
//     priority: String,
//     customerInformation: String,
//     narrative: String,
//     RecordNumber: int,
//     status: {
//         default: true
//     }
// }
const incidentModel = mongoose.model('incident', incidentSchema)
module.exports = incidentModel