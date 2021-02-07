import mongoose from 'mongoose';

const TagEnum = [
    "CATEGORY",
    "LOCATION",
    "PRICE_RANGE"
]

const tagSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: TagEnum,
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

export { tagSchema, TagEnum };
