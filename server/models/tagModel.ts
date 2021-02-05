import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: [
            "CATEGORY",
            "LOCATION",
            "PRICE_RANGE"
        ],
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const Tag = mongoose.model('Tag', tagSchema);

export { Tag };
