import { Client, ClientInterface } from '../../database/models/clientModel'
import { Request, RequestInterface } from '../../database/models/requestModel'
import { RequestEmbeddingInterface, RequestType, RequestTypeInterface } from '../../database/models/requestTypeModel'
import { RequestGroup, RequestGroupInterface } from '../../database/models/requestGroupModel'

import { filterOpenRequestEmbeddings, nextRequestEmbeddingForRequestType } from './requestTypeResolvers'

import { sessionHandler } from '../utils/session'

const nextRequestEmbeddingForRequestGroup = async (requestGroup, session) => {
    const nextRequestsForAllRequestTypes: Array<RequestEmbeddingInterface> = await Promise.all(requestGroup.requestTypes.map(async (requestTypeEmbedding) => {
        const requestType = await RequestType.findById(requestTypeEmbedding._id).session(session)
        return nextRequestEmbeddingForRequestType(requestType, session)
    }))

    if (nextRequestsForAllRequestTypes === null) {
        return null
    }

    const sortedNextRequests = nextRequestsForAllRequestTypes
        .sort((requestEmbedding1, requestEmbedding2) => {
            if (requestEmbedding1 === null) {
                return 1
            }

            if (requestEmbedding2 === null) {
                return -1
            }
            
            return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
        })
    
    if (sortedNextRequests.length === 0) {
        return null
    }

    return sortedNextRequests[0]
}

const requestGroupQueryResolvers = {
    requestGroup: async (_, { _id }, ___): Promise<RequestGroupInterface> => {
        return RequestGroup.findById(_id).exec()
    },
    requestGroups: async (_, __, ___): Promise<Array<RequestGroupInterface>> => {
        return RequestGroup.find().exec()
    },
    requestGroupsPage: async (_, { skip, limit }, __): Promise<Array<RequestGroupInterface>> => {
        return RequestGroup.find().sort({ "name": "ascending", "_id": "ascending" }).skip(skip).limit(limit).exec()
    },
    /* Left as a proof of concept:
    requestGroupsFilter: async (_, { filter, options }, ___): Promise<Array<RequestGroupInterface>> => {
        return RequestGroup.find().exec()
    },*/
}

const requestGroupMutationResolvers = {
    createRequestGroup: async (_, { requestGroup }, { authenticateUser }): Promise<RequestGroupInterface> => {
        return authenticateUser().then(async () => { 
            const newRequestGroup = new RequestType({...requestGroup})
            const createdRequestGroup = await newRequestGroup.save()

            return createdRequestGroup
        })
    },
    updateRequestGroup: async (_, { requestGroup }, { authenticateUser }): Promise<RequestGroupInterface> => {
        return authenticateUser().then(async () => {
            const oldRequestGroup = await RequestGroup.findById(requestGroup._id)
            const modifiedRequestGroup = new RequestType({...oldRequestGroup, ...requestGroup})

            return modifiedRequestGroup.save()
        })
    },
    deleteRequestGroup: async (_, { _id }, { authenticateUser }): Promise<RequestGroupInterface> => {
        return authenticateUser().then(async () => {
            const requestGroup = await RequestGroup.findById(_id)
            requestGroup.deletedAt = new Date()
            return requestGroup.save()
        })
    },
}

const requestGroupResolvers = {
    requestTypes: async (parent, __, ___): Promise<Array<RequestTypeInterface>> => {
        return parent.requestTypes.map((requestTypeEmbedding) => {
            return RequestType.findById(requestTypeEmbedding._id)
        })
    },
    deleted: (parent, __, ___): boolean => {
        return parent.deletedAt !== undefined
    },
    countOpenRequests: async (parent, __, ___): Promise<number> => {
        const countOpenRequestsPerType: Array<number> = await Promise.all(parent.requestTypes.map(async (requestTypeEmbedding) => {
            const requestType = await RequestType.findById(requestTypeEmbedding._id)
            return filterOpenRequestEmbeddings(requestType.requests).length
        }))

        return countOpenRequestsPerType.reduce((total : number, openRequestsInRequestType : number) => total + openRequestsInRequestType, 0)
    },
    nextRequest: async (parent, __, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const nextRequestEmbedding = await nextRequestEmbeddingForRequestGroup(parent, session)

                if (nextRequestEmbedding === null) {
                    return null
                }

                return Request.findById(nextRequestEmbedding._id).session(session)
            })
        })
    },
    nextRecipient: async (parent, __, { authenticateUser }): Promise<ClientInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const nextRequestEmbedding = await nextRequestEmbeddingForRequestGroup(parent, session)

                if (nextRequestEmbedding === null) {
                    return null
                }

                const nextRequest = await Request.findById(nextRequestEmbedding._id).session(session)

                return Client.findById(nextRequest.client).session(session)
            })
        })
    },
    hasAnyRequests: async (parent, __, ___): Promise<boolean> => {
        return sessionHandler(async (session) => {
            const countUndeletedRequestsPerType: Array<number> = await Promise.all(parent.requestTypes.map(async (requestTypeEmbedding) => {
                const requestType = await RequestType.findById(requestTypeEmbedding._id).session(session)
                return requestType.requests.filter((requestEmbedding) => {
                    return requestEmbedding.deletedAt === undefined
                }).length
            }))
            
            const countUndeletedRequests = countUndeletedRequestsPerType.reduce((total, openRequestsInRequestType) => total + openRequestsInRequestType, 0)

            return countUndeletedRequests > 0
        })
    },
}

export { requestGroupQueryResolvers, requestGroupMutationResolvers, requestGroupResolvers }
