import { Document, model, Schema, Types } from "mongoose";

interface DonationFormContributionTuple {
    donationForm: Types.ObjectId;
    quantity: number;
}

interface RequestInterface extends Document {
    _id: Types.ObjectId;

    // Properties
    quantity: number;
    clientName: string;

    // References
    requestType: Types.ObjectId;
    matchedDonations: Array<DonationFormContributionTuple>;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;

    // Timestamps for Statuses
    deletedAt: Date;
    fulfilledAt: Date;
}

const requestSchema = new Schema(
    {
        // Properties
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        clientName: {
            type: String,
            required: true
        },

        // References
        requestType: {
            type: Types.ObjectId,
            ref: "RequestType"
        },
        matchedDonations: {
            type: [
                {
                    donationForm: { type: Types.ObjectId, ref: "DonationForm", required: true },
                    quantity: { type: Number, required: true }
                }
            ],
            default: []
        },

        // Timestamps for Statuses
        deletedAt: {
            type: Date
        },
        fulfilledAt: {
            type: Date
        }
    }, // Options
    {
        timestamps: true
    }
);

const Request = model<RequestInterface>("Request", requestSchema);

export { Request, RequestInterface };
