import {
  donationFormMutationResolvers,
  donationFormQueryResolvers,
  DonationItemCondition,
  DonationItemStatus,
} from "./resolvers/donationFormResolvers";

import {
  requestGroupMutationResolvers,
  requestGroupQueryResolvers,
  requestGroupResolvers,
} from "./resolvers/requestGroupResolvers";

import {
  requestMutationResolvers,
  requestQueryResolvers,
  requestResolvers,
} from "./resolvers/requestResolvers";

import {
  requestTypeMutationResolvers,
  requestTypeQueryResolvers,
  requestTypeResolvers,
} from "./resolvers/requestTypeResolvers";

const resolvers = {
  DonationItemCondition,
  DonationItemStatus,

  Query: {
    ...donationFormQueryResolvers,
    ...requestQueryResolvers,
    ...requestTypeQueryResolvers,
    ...requestGroupQueryResolvers,
  },

  Mutation: {
    ...donationFormMutationResolvers,
    ...requestMutationResolvers,
    ...requestTypeMutationResolvers,
    ...requestGroupMutationResolvers,
  },

  Request: {
    ...requestResolvers,
  },

  RequestType: {
    ...requestTypeResolvers,
  },

  RequestGroup: {
    ...requestGroupResolvers,
  },
};

export { resolvers };
