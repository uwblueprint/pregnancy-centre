export {}
const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
    category_name: {
        type: String
    },
    category_value: {
        type: String
    }
})

module.exports = flagSchema


