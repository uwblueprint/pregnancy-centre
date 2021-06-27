import { donationFormQueryResolvers } from './resolvers/donationFormResolvers'
import { donationGroupQueryResolvers } from './resolvers/donationGroupResolvers'
import { requestGroupMutationResolvers, requestGroupQueryResolvers, requestGroupResolvers } from './resolvers/requestGroupResolvers'
import { requestMutationResolvers, requestQueryResolvers, requestResolvers } from './resolvers/requestResolvers'
import { requestTypeMutationResolvers, requestTypeQueryResolvers, requestTypeResolvers } from './resolvers/requestTypeResolvers'

const resolvers = {
    Query: {
        ...donationFormQueryResolvers,
        ...donationGroupQueryResolvers,
        ...requestQueryResolvers,
        ...requestTypeQueryResolvers,
        ...requestGroupQueryResolvers,
    },

    Mutation: {
        ...requestMutationResolvers,
        ...requestTypeMutationResolvers,
        ...requestGroupMutationResolvers
    },

    Request: {
        ...requestResolvers
    },

    RequestType: {
        ...requestTypeResolvers
    },

    RequestGroup: {
        ...requestGroupResolvers
    }
};

export { resolvers };
