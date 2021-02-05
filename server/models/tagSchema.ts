import mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    category_name: {
        type: String
    },
    category_value: {
        type: String
    }
})

module.exports = tagSchema;
