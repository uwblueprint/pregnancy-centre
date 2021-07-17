import { Document, model, Schema, Types } from "mongoose";

interface RequestTypeEmbeddingInterface {
    _id: Types.ObjectId;
}

interface RequestGroupInterface extends Document {
    _id: Types.ObjectId;

    // Properties
    name: string;
    description: string;
    image: string;

    // Embedded Objects
    requestTypes: Array<RequestTypeEmbeddingInterface>;

    // Timestamps for Statuses
    deletedAt: Date;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

const RequestGroupSchema = new Schema(
    {
        // Properties
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            default: ""
        },
        image: {
            type: String,
            required: true,
            default: ""
        },

        // Embedded Objects
        requestTypes: {
            type: [
                {
                    _id: { type: Types.ObjectId, ref: "RequestType" }
                }
            ],
            default: []
        },

        // Timestamps for Statuses
        deletedAt: {
            type: Date
        }
    }, // Options
    {
        timestamps: true
    }
);

const RequestGroup = model<RequestGroupInterface>("RequestGroup", RequestGroupSchema);

export { RequestGroup, RequestGroupInterface, RequestTypeEmbeddingInterface };
