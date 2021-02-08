import mongoose from 'mongoose';

interface TagDocument {
    _id: mongoose.Types.ObjectId
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
        type: Object,
        required: true
    }
});

export { tagSchema, TagEnum, TagDocument };
