const mongoose = require('mongoose')
const Schema = mongoose.Schema

const incidentSchema = new Schema({
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
    description: {
        type: String,
        required: true,
        maxlength: 500
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

const incidentModel = mongoose.model('incident', incidentSchema)
module.exports = incidentModel