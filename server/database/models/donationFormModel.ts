import { Document, model, Schema, Types } from "mongoose";
interface DonationFormInterface extends Document {
  _id: Types.ObjectId;

  // Properties
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNum: string;
  };

  name: string;
  requestGroup?: Types.ObjectId;
  description?: string;
  quantity: number;
  age: number;
  condition: string;
  images: Array<string>;

  // Properties for admin
  adminNotes?: string;
  status: string;
  quantityMatched: number;

  // Timestamps
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
      phoneNum: { type: String, required: true },
    },
    name: {
      type: String,
      required: true,
    },
    requestGroup: {
      type: Types.ObjectId,
      ref: "RequestGroup",
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ["POOR", "FAIR", "GOOD", "GREAT", "BRAND_NEW"],
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
    adminNotes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING_APPROVAL", "PENDING_DROPOFF", "PENDING_MATCH"],
    },
    quantityMatched: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DonationForm = model<DonationFormInterface>(
  "DonationForm",
  DonationFormSchema
);

export { DonationForm, DonationFormInterface };
