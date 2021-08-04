import { DonationForm, DonationFormInterface } from "../../database/models/donationFormModel";
import { RequestGroup, RequestGroupInterface } from "../../database/models/requestGroupModel";

enum SortOptions {
    CREATED_AT = "CREATED_AT",
    MATCHED_AT = "MATCHED_AT"
}

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
    donationFormsPage: async (_, { skip, limit, filterOptions, sortBy }, __): Promise<Array<DonationFormInterface>> => {
        const { name, deleted, requestGroup, formType, status, statusNot } = filterOptions;
        const filter: any = {};

        if (deleted === true) {
            filter.deletedAt = { $ne: null };
        } else if (deleted === false) {
            filter.deletedAt = null;
        }
        if (requestGroup) {
            filter.requestGroup = { $eq: requestGroup };
        }
        if (formType) {
            if (formType === "GENERAL") {
                filter.requestGroup = { $eq: null };
            }
            if (formType === "SPECIFIC") {
                filter.requestGroup = { ...filter.requestGroup, $ne: null };
            }
        }
        if (status) {
            filter.status = status;
        }
        if (statusNot) {
            filter.status = { $ne: statusNot };
        }

        let sortConfig: any = { createdAt: "descending" };
        if (sortBy === SortOptions.MATCHED_AT) {
            sortConfig = {
                matchedAt: "descending"
            };
        }

        return DonationForm.find(filter).sort(sortConfig).skip(skip).limit(limit).exec();
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
        return authenticateUser().then(async () => {
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
