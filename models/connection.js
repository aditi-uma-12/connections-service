const mongoose = require('mongoose');


const dataSchema = new mongoose.Schema({
    users: {
        required: true,
        type: [String]
    }
})

module.exports = mongoose.model('Connection', dataSchema)