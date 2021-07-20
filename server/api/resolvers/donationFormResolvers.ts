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
    },
    donationFormsPage: async (_, { skip, limit, name }, __): Promise<Array<DonationFormInterface>> => {
        if (name) {
            return DonationForm.find({ name: { $regex: "^" + name + ".*", $options: "i" } })
                .sort({ name: "ascending", _id: "ascending" })
                .skip(skip)
                .limit(limit)
                .exec();
        } else {
            return DonationForm.find().sort({ name: "ascending", _id: "ascending" }).skip(skip).limit(limit).exec();
        }
    },
};

const donationFormMutationResolvers = {
    createDonationForm: async (_, { donationForm }, ___): Promise<DonationFormInterface> => {
        const newDonationForm = await new DonationForm({ ...donationForm }).save();

        // link donation group to request group
        if (newDonationForm.requestGroup) {
            await addDonationFormToRequestGroup(donationForm, newDonationForm.requestGroup);
        }
        return newDonationForm;
    }
};

const donationFormResolvers = {
    requestGroup: async (donationForm, __, ___): Promise<RequestGroupInterface> => {
        return RequestGroup.findById(donationForm.requestGroup);
    }
};

export { donationFormMutationResolvers, donationFormQueryResolvers, donationFormResolvers };
