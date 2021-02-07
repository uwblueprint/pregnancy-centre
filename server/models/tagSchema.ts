import mongoose from 'mongoose';

interface TagDocument {
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
