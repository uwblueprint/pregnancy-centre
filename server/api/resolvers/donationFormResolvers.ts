import { DonationForm, DonationFormInterface } from '../../database/models/donationFormModel'

const donationFormQueryResolvers = {
    donationForm: async (_, { _id }, ___): Promise<DonationFormInterface> => {
        return DonationForm.findById(_id).exec()
    },
    donationForms: async (_, __, ___): Promise<Array<DonationFormInterface>> => {
        return DonationForm.find().exec()
    }
}

export { donationFormQueryResolvers }