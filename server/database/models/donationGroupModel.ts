import { Document, model, Schema, Types } from "mongoose";

interface DonationGroupInterface extends Document {
  _id: Types.ObjectId;

  // Properties
  name: string;
  requestGroup?: Types.ObjectId;
  description?: string;
  quantity: number;
  age: number;
  condition: string;
  images: Array<string>;

  // reference to donation form
  donationForm: Types.ObjectId;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const DonationGroupSchema = new Schema(
  {
    // Properties
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
      enum: ["Poor", "Fair", "Good", "Great", "Brand New"],
    },
    images: {
      type: [String],
      default: [],
    },

    donationForm: {
      type: Types.ObjectId,
      ref: "DonationForm",
    },
  }, // Options
  {
    timestamps: true,
  }
);

const DonationGroup = model<DonationGroupInterface>(
  "DonationGroup",
  DonationGroupSchema
);

export { DonationGroup, DonationGroupInterface };
