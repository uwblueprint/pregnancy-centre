import {
    donationFormMutationResolvers,
    donationFormQueryResolvers,
    donationFormResolvers
} from "./resolvers/donationFormResolvers";
import { DonationItemCondition, DonationItemStatus } from "../database/models/donationFormModel";

import {
    requestGroupMutationResolvers,
    requestGroupQueryResolvers,
    requestGroupResolvers
} from "./resolvers/requestGroupResolvers";

import { requestMutationResolvers, requestQueryResolvers, requestResolvers } from "./resolvers/requestResolvers";

import {
    requestTypeMutationResolvers,
    requestTypeQueryResolvers,
    requestTypeResolvers
} from "./resolvers/requestTypeResolvers";

import { emailResolvers } from "./resolvers/emailResolvers";

const resolvers = {
    DonationItemCondition,
    DonationItemStatus,

    Query: {
        ...donationFormQueryResolvers,
        ...requestQueryResolvers,
        ...requestTypeQueryResolvers,
        ...requestGroupQueryResolvers
    },

    Mutation: {
        ...donationFormMutationResolvers,
        ...requestMutationResolvers,
        ...requestTypeMutationResolvers,
        ...requestGroupMutationResolvers,
        ...emailResolvers
    },

    Request: {
        ...requestResolvers
    },

    RequestType: {
        ...requestTypeResolvers
    },

    RequestGroup: {
        ...requestGroupResolvers
    },

    DonationForm: {
        ...donationFormResolvers
    }
};

export { resolvers };
