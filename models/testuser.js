const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    latitude: {
        required: true,
        type: String
    },
    longitude:{
        required: true,
        type: String
    },
    organization: {
        required: true,
        type: String 
    }
})

module.exports = mongoose.model('testuser', dataSchema)