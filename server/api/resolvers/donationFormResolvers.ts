import { DonationForm, DonationFormInterface } from "../../database/models/donationFormModel";
import { RequestGroup, RequestGroupInterface } from "../../database/models/requestGroupModel";

const donationFormEmbeddingFromDonationForm = (donationForm: DonationFormInterface) => {
    return {
        _id: donationForm._id
    };
};
const addDonationFormToRequestGroup = async (donationForm, requestGroupId) => {
    const newRequestGroup = await RequestGroup.findById(requestGroupId);
    newRequestGroup.donationForms.push(donationFormEmbeddingFromDonationForm(donationForm));
    await newRequestGroup.save();
};

const donationFormQueryResolvers = {
    donationForm: async (_, { _id }, ___): Promise<DonationFormInterface> => {
        return DonationForm.findById(_id).exec();
    },
    donationForms: async (_, __, ___): Promise<Array<DonationFormInterface>> => {
        return DonationForm.find().exec();
    }
};

const donationFormMutationResolvers = {
    createDonationForm: async (_, { donationForm }, ___): Promise<DonationFormInterface> => {
        const newDonationForm = await new DonationForm({ ...donationForm }).save();

        // link donation group to request group
        if (newDonationForm.requestGroup) {
            await addDonationFormToRequestGroup(donationForm, newDonationForm.requestGroup);
        }
        return newDonationForm;
    },
    updateDonationForm: async (_, { donationForm }, { authenticateUser }): Promise<DonationFormInterface> => {
        return authenticateUser.then(async () => {
            return DonationForm.findByIdAndUpdate(donationForm._id, donationForm, { lean: true });
        });
    },
    deleteDonationForm: async (_, { _id }, { authenticateUser }): Promise<DonationFormInterface> => {
        return authenticateUser().then(async () => {
            const donationForm = await DonationForm.findById(_id);
            donationForm.deletedAt = new Date();
            return donationForm.save();
        });
    }
};

const donationFormResolvers = {
    requestGroup: async (donationForm, __, ___): Promise<RequestGroupInterface> => {
        return RequestGroup.findById(donationForm.requestGroup);
    }
};

export { donationFormMutationResolvers, donationFormQueryResolvers, donationFormResolvers };
