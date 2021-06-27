import { requestGroupMutationResolvers, requestGroupQueryResolvers, requestGroupResolvers } from './resolvers/requestGroupResolvers'
import { requestMutationResolvers, requestQueryResolvers, requestResolvers } from './resolvers/requestResolvers'
import { requestTypeMutationResolvers, requestTypeQueryResolvers, requestTypeResolvers } from './resolvers/requestTypeResolvers'
import { donationFormQueryResolvers } from './resolvers/donationFormResolvers'

const resolvers = {
    Query: {
        ...requestQueryResolvers,
        ...requestTypeQueryResolvers,
        ...requestGroupQueryResolvers,
        ...donationFormQueryResolvers
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
