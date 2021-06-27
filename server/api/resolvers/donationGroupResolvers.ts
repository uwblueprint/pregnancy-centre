import { DonationGroup, DonationGroupInterface } from '../../database/models/donationGroupModel'

const donationGroupQueryResolvers = {
    donationGroup: async (_, { _id }, ___): Promise<DonationGroupInterface> => {
        return DonationGroup.findById(_id).exec()
    },
    donationGroups: async (_, __, ___): Promise<Array<DonationGroupInterface>> => {
        return DonationGroup.find().exec()
    }
}

export { donationGroupQueryResolvers }