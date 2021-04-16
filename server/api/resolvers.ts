import { clientQueryResolvers, clientMutationResolvers } from './resolvers/clientResolvers'
import { requestQueryResolvers, requestMutationResolvers, requestResolvers } from './resolvers/requestResolvers'
import { requestGroupQueryResolvers, requestGroupMutationResolvers, requestGroupResolvers } from './resolvers/requestGroupResolvers'
import { requestTypeQueryResolvers, requestTypeMutationResolvers, requestTypeResolvers } from './resolvers/requestTypeResolvers'

const resolvers = {
    Query: {
        ...clientQueryResolvers,
        ...requestQueryResolvers,
        ...requestTypeQueryResolvers,
        ...requestGroupQueryResolvers,
    },
    
    Mutation: {
        ...clientMutationResolvers,
        ...requestMutationResolvers,
        ...requestTypeMutationResolvers,
        ...requestGroupMutationResolvers,
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
}

export { resolvers }
