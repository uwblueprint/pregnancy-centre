import { Request, RequestInterface } from '../../database/models/requestModel'
import { RequestGroup, RequestGroupInterface } from '../../database/models/requestGroupModel'
import { RequestType, RequestTypeInterface } from '../../database/models/requestTypeModel'

import { infoContainsOnlyFields } from '../utils/info'
import { sessionHandler } from '../utils/session'

const filterOpenRequestEmbeddings = ( requestEmbeddings ) => {
    return requestEmbeddings.filter((requestEmbedding) => {
        return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
    })
}

const filterFulfilledRequestEmbeddings = ( requestEmbeddings ) => {
    return requestEmbeddings.filter((requestEmbedding) => {
        return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt !== undefined
    })
}

// obtains embeddings of all deleted Request's
const filterDeletedRequestEmbeddings = ( requestEmbeddings ) => {
    return requestEmbeddings.filter((requestEmbedding) => {
        return requestEmbedding.deletedAt !== undefined
    })
}

const requestTypeEmbeddingFromRequestType = ( requestType: RequestTypeInterface ) => {
    return {
        _id: requestType._id
    }
}

const swapRequestGroupForRequestType = async ( requestType, oldRequestGroupID, newRequestGroupID, session ) => {
    const oldRequestGroup = await RequestGroup.findById(oldRequestGroupID).session(session)
    oldRequestGroup.requestTypes = oldRequestGroup.requestTypes.filter((requestEmbedding) => {
        return requestEmbedding._id !== requestType._id
    })

    const newRequestGroup = await RequestGroup.findById(newRequestGroupID).session(session)
    newRequestGroup.requestTypes.push(requestTypeEmbeddingFromRequestType(requestType))

    await oldRequestGroup.save({ session: session })
    await newRequestGroup.save({ session: session })
}

const nextRequestEmbeddingForRequestType = ( requestType, session ) => {
    const filteredOpenRequests = filterOpenRequestEmbeddings(requestType.requests)

    if (filteredOpenRequests.length === 0) {
        return null
    }
    
    // sort open requests in ascending order by creation date
    const sortedOpenRequests = filteredOpenRequests.sort((requestEmbedding1, requestEmbedding2) => {
        return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
    })

    return sortedOpenRequests[0]
}

const requestTypeQueryResolvers = {
    requestType: async (_, { _id }, ___): Promise<RequestTypeInterface> => {
        return RequestType.findById(_id).exec()
    },
    requestTypes: async (_, __, ___): Promise<Array<RequestTypeInterface>> => {
        return RequestType.find().exec()
    },
    requestTypesPage: async (_, { skip, limit }, __): Promise<Array<RequestTypeInterface>> => {
        return RequestType.find().sort({ "name": "ascending", "_id": "ascending" }).skip(skip).limit(limit).exec()
    },
    countRequestTypes: async (_, __, ___): Promise<number> => {
        return RequestType.countDocuments();
    },
    /* Left as a proof of concept:
    requestTypesFilter: async (_, { filter, options }, ___): Promise<Array<RequestTypeInterface>> => {
        return RequestType.find().exec()
    },*/
}

const requestTypeMutationResolvers = {
    createRequestType: async (_, { requestType }, { authenticateUser }): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => { 
            return sessionHandler(async (session) => {
                const newRequestTypeObject = new RequestType({...requestType})
                const newRequestType = await newRequestTypeObject.save({ session: session })
                
                const requestGroup = await RequestGroup.findById(newRequestType.requestGroup).session(session)
                requestGroup.requestTypes.push({ 
                    _id: newRequestType._id
                })
                await requestGroup.save({ session: session })

                return newRequestType
            })
        })
    },
    updateRequestType: async (_, { requestType }, { authenticateUser }): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const oldRequestType = await RequestType.findById(requestType._id).session(session)
                const modifiedRequestTypeObject = new RequestType({...oldRequestType, ...requestType})
                const newRequestType = await modifiedRequestTypeObject.save({ session: session })

                if (oldRequestType.requestGroup !== newRequestType.requestGroup) {
                    swapRequestGroupForRequestType(newRequestType, oldRequestType.requestGroup, newRequestType.requestGroup, session)
                }

                return newRequestType
            })
        })
    },
    deleteRequestType: async (_, { _id }, { authenticateUser }): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => {
            const requestType = await RequestType.findById(_id)
            requestType.deletedAt = new Date()
            return requestType.save()
        })
    },
    changeRequestGroupForRequestType: async (_, { requestTypeId, requestGroupId }, { authenticateUser }): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const modifiedRequestTypeObject = await RequestType.findById(requestTypeId).session(session)

                if (modifiedRequestTypeObject.requestGroup !== requestGroupId) {
                    swapRequestGroupForRequestType(modifiedRequestTypeObject, requestGroupId, modifiedRequestTypeObject.requestGroup, session)
                }

                modifiedRequestTypeObject.requestGroup = requestGroupId
                return modifiedRequestTypeObject.save({ session: session })
            })
        })
    },
}

const requestTypeResolvers = {
    requestGroup: async (parent, __, ___): Promise<RequestGroupInterface> => {
        return RequestGroup.findById(parent.requestGroup)
    },
    requests: async (parent, __, ___, info): Promise<Array<RequestInterface>> => {
        // if we only want fields in the embedding, then pass the embedding along
        if (infoContainsOnlyFields(info, ['_id', 'createdAt', 'deletedAt', 'fulfilledAt'])) {
            return parent.requests;
        }

        // otherwise, get the underlying Requests from the database
        return parent.requests.map((requestEmbedding) => {
            return Request.findById(requestEmbedding._id)
        });
    },
    deleted: (parent, __, ___): boolean => {
        return parent.deletedAt !== undefined
    },
    openRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
        return filterOpenRequestEmbeddings(parent.requests)
            .map((requestEmbedding) => {
                return Request.findById(requestEmbedding._id)
            })
        },
    fulfilledRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
        return filterFulfilledRequestEmbeddings(parent.requests)
            .map((requestEmbedding) => {
                return Request.findById(requestEmbedding._id)
            })
    },
    deletedRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
        return filterDeletedRequestEmbeddings(parent.requests)
            .map((requestEmbedding) => {
                return Request.findById(requestEmbedding._id)
            })
    },
    countOpenRequests: (parent, __, ___): number => {
        return filterOpenRequestEmbeddings(parent.requests).length
    },
    nextRequest: async (parent, __, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            const nextRequestEmbedding = await nextRequestEmbeddingForRequestType(parent, null)
            
            if (nextRequestEmbedding === null) { 
                return null
            }

            return Request.findById(nextRequestEmbedding._id)
        })
    },
    nextRecipient: async (parent, __, { authenticateUser }): Promise<String> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const nextRequestEmbedding = await nextRequestEmbeddingForRequestType(parent, null)
                
                if (nextRequestEmbedding === null) { 
                    return null
                }

                const nextRequest = await Request.findById(nextRequestEmbedding._id).session(session)
                return nextRequest.clientName
            })
        })
    },
}

export { requestTypeQueryResolvers, requestTypeMutationResolvers, requestTypeResolvers, filterOpenRequestEmbeddings, nextRequestEmbeddingForRequestType }
