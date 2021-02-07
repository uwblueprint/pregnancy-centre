import mongoose from 'mongoose';

interface TagDocument {
    _id: mongoose.ObjectId
    type: string
    value: string
}

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
        type: String,
        required: true
    }
});

export { tagSchema, TagEnum, TagDocument };
