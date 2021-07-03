import {
  DonationForm,
  DonationFormInterface,
} from "../../database/models/donationFormModel";

enum DonationItemCondition {
  BRAND_NEW = "BRAND_NEW",
  GREAT = "GREAT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
}

enum DonationItemStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  PENDING_DROPOFF = "PENDING_DROPOFF",
  PENDING_MATCH = "PENDING_MATCH",
}

const donationFormQueryResolvers = {
  donationForm: async (_, { _id }, ___): Promise<DonationFormInterface> => {
    return DonationForm.findById(_id).exec();
  },
  donationForms: async (_, __, ___): Promise<Array<DonationFormInterface>> => {
    return DonationForm.find().exec();
  },
};

const donationFormMutationResolvers = {
  createDonationForm: async (_, { donationForm }, { authenticateUser }): Promise<DonationFormInterface> => {
      return authenticateUser().then(async () => { 
        const newDonationFormObject = new DonationForm({...donationForm})
        const newDonationForm = await newDonationFormObject.save()
        
        return newDonationForm
      })
  }
}

export {
  donationFormMutationResolvers,
  donationFormQueryResolvers,
  DonationItemCondition,
  DonationItemStatus,
};
