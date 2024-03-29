import { Document, model, Schema, Types } from "mongoose";

interface RequestEmbeddingInterface {
    _id: Types.ObjectId;
    createdAt: Date;
    deletedAt: Date;
    fulfilledAt: Date;
}

interface RequestTypeInterface extends Document {
    _id: Types.ObjectId;

    // Properties
    name: string;

    // References
    requestGroup: Types.ObjectId;

    // Embedded Objects
    requests: Array<RequestEmbeddingInterface>;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;

    // Timestamps for Statuses
    deletedAt: Date;
}

const RequestTypeSchema = new Schema(
    {
        // Properties
        name: {
            type: String,
            required: true
        },

        // References
        requestGroup: {
            type: Types.ObjectId,
            ref: "RequestGroup"
        },

        // Embedded Objects
        requests: {
            type: [
                {
                    // @ts-ignore
                    _id: { type: Types.ObjectId, ref: "Request" },
                    createdAt: { type: Date },
                    deletedAt: { type: Date },
                    fulfilledAt: { type: Date }
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

const RequestType = model<RequestTypeInterface>("RequestType", RequestTypeSchema);

export { RequestType, RequestTypeInterface, RequestEmbeddingInterface };
