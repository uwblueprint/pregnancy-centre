import { Document, model, Schema, Types } from "mongoose";

interface DonationGroupEmbeddingInterface {
  _id: Types.ObjectId;
}

interface DonationFormInterface extends Document {
  _id: Types.ObjectId;

  // Properties
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNum: string;
  };

  confirmationNumber: number;

  // Embedded Objects
  donationGroups: Array<DonationGroupEmbeddingInterface>;

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

    confirmationNumber: { type: Number, required: true, min: 0, max: 999999 },

    // Embedded Objects
    donationGroups: {
      type: [
        {
          _id: { type: Types.ObjectId, ref: "DonationGroup" },
        },
      ],
      default: [],
    },
  }, // Options
  {
    timestamps: true,
  }
);

const DonationForm = model<DonationFormInterface>(
  "DonationForm",
  DonationFormSchema
);

export { DonationForm, DonationFormInterface, DonationGroupEmbeddingInterface };
