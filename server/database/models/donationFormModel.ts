import { Document, model, Schema, Types } from "mongoose";

enum DonationItemCondition {
    BRAND_NEW = "BRAND_NEW",
    GREAT = "GREAT",
    GOOD = "GOOD",
    FAIR = "FAIR",
    POOR = "POOR"
}

enum DonationItemStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    PENDING_DROPOFF = "PENDING_DROPOFF",
    PENDING_MATCH = "PENDING_MATCH",
    MATCHED = "MATCHED"
}

interface DonationFormInterface extends Document {
    _id: Types.ObjectId;

    // Properties
    contact: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };

    name: string;
    requestGroup?: Types.ObjectId;
    description?: string;
    quantity: number;
    age: number;
    condition: DonationItemCondition;
    images: Array<string>;

    // Properties for admin
    adminNotes?: string;
    status: DonationItemStatus;
    quantityRemaining: number;

    // Timestamps
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const DonationFormSchema = new Schema(
    {
        // Properties
        contact: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phoneNumber: { type: String, required: true }
        },
        name: {
            type: String,
            required: true
        },
        requestGroup: {
            type: Types.ObjectId,
            ref: "RequestGroup",
            required: false
        },
        description: {
            type: String,
            required: false
        },
        quantity: {
            type: Number,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        condition: {
            type: String,
            required: true,
            enum: Object.keys(DonationItemCondition)
        },
        images: {
            type: [String],
            required: false,
            default: []
        },
        adminNotes: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: true,
            enum: Object.keys(DonationItemStatus)
        },
        quantityRemaining: {
            type: Number,
            required: true,
            default: 0
        },
        deletedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const DonationForm = model<DonationFormInterface>("DonationForm", DonationFormSchema);

export { DonationForm, DonationFormInterface, DonationItemCondition, DonationItemStatus };
