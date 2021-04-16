import { clientMutationResolvers, clientQueryResolvers } from './resolvers/clientResolvers'
import { requestGroupMutationResolvers, requestGroupQueryResolvers, requestGroupResolvers } from './resolvers/requestGroupResolvers'
import { requestMutationResolvers, requestQueryResolvers, requestResolvers } from './resolvers/requestResolvers'
import { requestTypeMutationResolvers, requestTypeQueryResolvers, requestTypeResolvers } from './resolvers/requestTypeResolvers'

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
