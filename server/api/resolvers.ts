import { UserInputError } from 'apollo-server-errors'
import { Types } from 'mongoose'
import { type } from 'os'

/* Models */
import { Client, ClientInterface } from '../database/models/clientModel'
import { RequestGroup, RequestGroupInterface } from '../database/models/requestGroupModel'
import { Request, RequestInterface } from '../database/models/requestModel'
import { RequestEmbeddingInterface, RequestType, RequestTypeInterface } from '../database/models/requestTypeModel'

/* Utility */
import { sessionHandler } from './utils/session'

const resolvers = {
    Query: {
        client: async (_, { _id }, { authenticateUser }): Promise<ClientInterface> => {
            return authenticateUser().then(() => {
                Client.findById(_id).exec()
            }) 

        },
        clients: async (_, __, { authenticateUser }): Promise<Array<ClientInterface>> => {
            return authenticateUser().then(() => {
                Client.find().exec()
            })
        },
        clientsFilter: async (_, { filter, options }, { authenticateUser }): Promise<Array<ClientInterface>> => {
            return authenticateUser().then(() => {
                Client.find({ fullName: filter.fullName }).exec()
            })
        },

        request: async (_, { _id }, ___): Promise<RequestInterface> => {
            return Request.findById(_id).exec()
        },
        requests: async (_, __, ___): Promise<Array<RequestInterface>> => {
            return Request.find().exec()
        },
        requestsFilter: async (_, { filter, options }, ___): Promise<Array<RequestInterface>> => {
            return Request.find().exec()
        },

        requestType: async (_, { _id }, ___): Promise<RequestTypeInterface> => {
            return RequestType.findById(_id).exec()
        },
        requestTypes: async (_, __, ___): Promise<Array<RequestTypeInterface>> => {
            return RequestType.find().exec()
        },
        requestTypesFilter: async (_, { filter, options }, ___): Promise<Array<RequestTypeInterface>> => {
            return RequestType.find().exec()
        },

        requestGroup: async (_, { _id }, ___): Promise<RequestGroupInterface> => {
            return RequestGroup.findById(_id).exec()
        },
        requestGroups: async (_, __, ___): Promise<Array<RequestGroupInterface>> => {
            return RequestGroup.find().exec()
        },
        requestGroupsFilter: async (_, { filter, options }, ___): Promise<Array<RequestGroupInterface>> => {
            return RequestGroup.find().exec()
        },
    },
    
    Mutation: {
        createClient: async (_, { client }, { authenticateUser }): Promise<ClientInterface> => {
            return authenticateUser().then(async () => {
                const newClient = new Client({...client})
                return newClient.save()
            })
        },
        updateClient: async (_, { client }, { authenticateUser }): Promise<ClientInterface> => {
            return authenticateUser().then(async () => {
                const currentClient = await Client.findById(client._id)
                const modifiedClient = {...currentClient, ...client}
                return modifiedClient.save()
            })
        },
        deleteClient: async (_, { _id }, { authenticateUser }): Promise<ClientInterface> => {
            return authenticateUser().then(async () => {
                const client = await Client.findById(_id)
                client.deletedAt = new Date()
                return client.save()
            })
        },

        createRequest: async (_, { request }, { authenticateUser }): Promise<RequestInterface> => {
            return authenticateUser().then(async () => { 
                return sessionHandler(async (session) => {
                    const newRequest = new Request({...request})
                    const createdRequest = await newRequest.save()
                    
                    const requestType = await RequestType.findById(createdRequest.requestType)
                    requestType.requests.push({ 
                        _id: createdRequest._id,
                        createdAt: createdRequest.createdAt,
                        deletedAt: createdRequest.deletedAt,
                        fulfilledAt: createdRequest.fulfilledAt
                    })
                    await requestType.save()

                    return createdRequest
                })
            })
        },
        updateRequest: async (_, { request }, { authenticateUser }): Promise<RequestInterface> => {
            return authenticateUser().then(async () => {
                return sessionHandler(async (session) => {
                    const oldRequest = await Request.findById(request._id)
                    const modifiedRequest = new Request({...oldRequest, ...request})
                    const newRequest = await modifiedRequest.save()

                    if (oldRequest.requestType !== newRequest.requestType) {
                        const oldRequestType = await RequestType.findById(oldRequest.requestType)
                        oldRequestType.requests = oldRequestType.requests.filter((requestEmbedding) => {
                            return requestEmbedding._id !== request._id
                        })
                        const newRequestType = await RequestType.findById(newRequest.requestType)
                        newRequestType.requests.push({ 
                            _id: newRequest._id,
                            createdAt: newRequest.createdAt,
                            deletedAt: newRequest.deletedAt,
                            fulfilledAt: newRequest.fulfilledAt
                        })
                        await oldRequestType.save()
                        await newRequestType.save()
                    }

                    return newRequest
                })
            })
        },
        deleteRequest: async (_, { _id }, { authenticateUser }): Promise<RequestInterface> => {
            return authenticateUser().then(async () => {
                const request = await Request.findById(_id)
                request.deletedAt = new Date()
                return request.save()
            })
        },
        fulfillRequest: async (_, { _id }, { authenticateUser }): Promise<RequestInterface> => {
            return authenticateUser().then(async () => {
                const request = await Request.findById(_id)
                request.fulfilledAt = new Date()
                return request.save()
            })
        },
        changeRequestTypeForRequest: async (_, { request, requestType }, { authenticateUser }): Promise<RequestInterface> => {
            return authenticateUser().then(async () => {
                return sessionHandler(async (session) => {
                    const modifiedRequest = await Request.findById(request)

                    if (modifiedRequest.requestType !== requestType) {
                        const oldRequestType = await RequestType.findById(modifiedRequest.requestType)
                        oldRequestType.requests = oldRequestType.requests.filter((requestEmbedding) => {
                            return requestEmbedding._id !== modifiedRequest._id
                        })
                        const newRequestType = await RequestType.findById(requestType)
                        newRequestType.requests.push({ 
                            _id: modifiedRequest._id,
                            createdAt: modifiedRequest.createdAt,
                            deletedAt: modifiedRequest.deletedAt,
                            fulfilledAt: modifiedRequest.fulfilledAt
                        })
                        await oldRequestType.save()
                        await newRequestType.save()
                    }

                    modifiedRequest.requestType = requestType
                    return modifiedRequest.save()
                })
            })
        },

        createRequestType: async (_, { requestType }, { authenticateUser }): Promise<RequestTypeInterface> => {
            return authenticateUser().then(async () => { 
                return sessionHandler(async (session) => {
                    const newRequestType = new RequestType({...requestType})
                    const createdRequestType = await newRequestType.save()
                    
                    const requestGroup = await RequestGroup.findById(createdRequestType.requestGroup)
                    requestGroup.requestTypes.push({ 
                        _id: createdRequestType._id
                    })
                    await requestGroup.save()

                    return createdRequestType
                })
            })
        },
        updateRequestType: async (_, { requestType }, { authenticateUser }): Promise<RequestTypeInterface> => {
            return authenticateUser().then(async () => {
                return sessionHandler(async (session) => {
                    const oldRequestType = await RequestType.findById(requestType._id)
                    const modifiedRequestType = new RequestType({...oldRequestType, ...requestType})
                    const newRequestType = await modifiedRequestType.save()

                    if (oldRequestType.requestGroup !== newRequestType.requestGroup) {
                        const oldRequestGroup = await RequestGroup.findById(oldRequestType.requestGroup)
                        oldRequestGroup.requestTypes = oldRequestGroup.requestTypes.filter((requestTypeEmbedding) => {
                            return requestTypeEmbedding._id !== requestType._id
                        })
                        const newRequestGroup = await RequestGroup.findById(newRequestType.requestGroup)
                        newRequestGroup.requestTypes.push({ 
                            _id: newRequestType._id 
                        })
                        await oldRequestGroup.save()
                        await newRequestGroup.save()
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
        changeRequestGroupForRequestType: async (_, { requestType, requestGroup }, { authenticateUser }): Promise<RequestTypeInterface> => {
            return authenticateUser().then(async () => {
                return sessionHandler(async (session) => {
                    const modifiedRequestType = await RequestType.findById(requestType)

                    if (modifiedRequestType.requestGroup !== requestGroup) {
                        const oldRequestGroup = await RequestGroup.findById(modifiedRequestType.requestGroup)
                        oldRequestGroup.requestTypes = oldRequestGroup.requestTypes.filter((requestTypeEmbedding) => {
                            return requestTypeEmbedding._id !== modifiedRequestType._id
                        })
                        const newRequestGroup = await RequestGroup.findById(requestGroup)
                        newRequestGroup.requestTypes.push({ 
                            _id: modifiedRequestType._id 
                        })
                        await oldRequestGroup.save()
                        await newRequestGroup.save()
                    }

                    modifiedRequestType.requestGroup = requestGroup
                    return modifiedRequestType.save()
                })
            })
        },


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
    },

    Request: {
        requestType: async (parent, __, ___): Promise<RequestTypeInterface> => {
            return RequestType.findById(parent.requestType)
        },
        client: async (parent, __, { authenticateUser }): Promise<ClientInterface> => {
            return authenticateUser().then(() => Client.findById(parent.client))
        },
        deleted: (parent, __, ___): Boolean => {
            return parent.deletedAt !== undefined
        },
        fulfilled: (parent, __, ___): Boolean => {
            return parent.fulfilledAt !== undefined
        },
    },

    RequestType: {
        requestGroup: async (parent, __, ___): Promise<RequestGroupInterface> => {
            return RequestGroup.findById(parent.requestGroup)
        },
        requests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
            return parent.requests.map((requestEmbedding) => {
                return Request.findById(requestEmbedding._id)
            })
        },
        deleted: (parent, __, ___): Boolean => {
            return parent.deletedAt !== undefined
        },
        openRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
            return parent.requests.filter((requestEmbedding) => {
                return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
            }).map((requestEmbedding) => {
                return Request.findById(requestEmbedding._id)
            })
        },
        fulfilledRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
            return parent.requests.filter((requestEmbedding) => {
                return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt !== undefined
            }).map((requestEmbedding) => {
                return Request.findById(requestEmbedding._id)
            })
        },
        deletedRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
            return parent.requests.filter((requestEmbedding) => {
                return requestEmbedding.deletedAt !== undefined
            }).map((requestEmbedding) => {
                return Request.findById(requestEmbedding._id)
            })
        },
        countOpenRequests: (parent, __, ___): number => {
            return parent.requests.filter((requestEmbedding) => {
                return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
            }).length
        },
        nextRequest: async (parent, __, { authenticateUser }): Promise<RequestInterface> => {
            return authenticateUser().then(async () => {
                const filteredOpenRequests = parent.requests.filter((requestEmbedding) => {
                    return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
                })

                if (filteredOpenRequests.length === 0) {
                    return null
                }
                
                // sort open requests in ascending order by creation date
                const sortedOpenRequests = filteredOpenRequests.sort((requestEmbedding1, requestEmbedding2) => {
                    return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
                })

                const firstOpenRequest = sortedOpenRequests[0]

                return Request.findById(firstOpenRequest._id)
            })
        },
        nextRecipient: async (parent, __, { authenticateUser }): Promise<ClientInterface> => {
            return authenticateUser().then(async () => {
                const filteredOpenRequests = parent.requests.filter((requestEmbedding) => {
                    return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
                })

                if (filteredOpenRequests.length === 0) {
                    return null
                }
                
                // sort open requests in ascending order by creation date
                const sortedOpenRequests = filteredOpenRequests.sort((requestEmbedding1, requestEmbedding2) => {
                    return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
                })

                const firstOpenRequest = sortedOpenRequests[0]

                return Client.findById((await Request.findById(firstOpenRequest._id)).client)
            })
        },
    },

    RequestGroup: {
        requestTypes: async (parent, __, ___): Promise<Array<RequestTypeInterface>> => {
            return parent.requestTypes.map((requestTypeEmbedding) => {
                return RequestType.findById(requestTypeEmbedding._id)
            })
        },
        deleted: (parent, __, ___): Boolean => {
            return parent.deletedAt !== undefined
        },
        countOpenRequests: async (parent, __, ___): Promise<number> => {
            const countOpenRequestsPerType: Array<number> = await Promise.all(parent.requestTypes.map(async (requestTypeEmbedding) => {
                const requestType = await RequestType.findById(requestTypeEmbedding._id)
                return requestType.requests.filter((requestEmbedding) => {
                    return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
                }).length
            }))

            return countOpenRequestsPerType.reduce((total : number, openRequestsInRequestType : number) => total + openRequestsInRequestType, 0)
        },
        nextRequest: async (parent, __, { authenticateUser }): Promise<RequestInterface> => {
            return authenticateUser().then(async () => {
                const nextRequestsForAllRequestTypes: Array<RequestEmbeddingInterface> = await Promise.all(parent.requestTypes.map(async (requestTypeEmbedding) => {
                    const requestType = await RequestType.findById(requestTypeEmbedding._id)
                    const filteredOpenRequests = requestType.requests.filter((requestEmbedding) => {
                        return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
                    })
    
                    if (filteredOpenRequests.length === 0) {
                        return null
                    }
                    
                    // sort open requests in ascending order by creation date
                    const sortedOpenRequests = filteredOpenRequests.sort((requestEmbedding1, requestEmbedding2) => {
                        return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
                    })
    
                    const firstOpenRequest = sortedOpenRequests[0]

                    return firstOpenRequest
                }))

                if (nextRequestsForAllRequestTypes === null) {
                    return null
                }

                const sortedNextRequests: Array<RequestEmbeddingInterface> = nextRequestsForAllRequestTypes
                    .sort((requestEmbedding1: RequestEmbeddingInterface, requestEmbedding2: RequestEmbeddingInterface) => {
                        if (requestEmbedding1 === null) {
                            return 1
                        }

                        if (requestEmbedding2 === null) {
                            return -1
                        }
                        
                        return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
                    })

                return Request.findById(sortedNextRequests[0]._id)
            })
        },
        nextRecipient: async (parent, __, { authenticateUser }): Promise<ClientInterface> => {
            return authenticateUser().then(async () => {
                const nextRequestsForAllRequestTypes: Array<RequestEmbeddingInterface> = await Promise.all(parent.requestTypes.map(async (requestTypeEmbedding) => {
                    const requestType = await RequestType.findById(requestTypeEmbedding._id)
                    const filteredOpenRequests = requestType.requests.filter((requestEmbedding) => {
                        return requestEmbedding.deletedAt === undefined && requestEmbedding.fulfilledAt === undefined
                    })
    
                    if (filteredOpenRequests.length === 0) {
                        return null
                    }
                    
                    // sort open requests in ascending order by creation date
                    const sortedOpenRequests = filteredOpenRequests.sort((requestEmbedding1, requestEmbedding2) => {
                        return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
                    })
    
                    const firstOpenRequest = sortedOpenRequests[0]

                    return firstOpenRequest
                }))

                if (nextRequestsForAllRequestTypes === null) {
                    return null
                }

                const sortedNextRequests: Array<RequestEmbeddingInterface> = nextRequestsForAllRequestTypes
                    .sort((requestEmbedding1: RequestEmbeddingInterface, requestEmbedding2: RequestEmbeddingInterface) => {
                        if (requestEmbedding1 === null) {
                            return 1
                        }

                        if (requestEmbedding2 === null) {
                            return -1
                        }
                        
                        return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds()
                    })

                const firstOpenRequest = await Request.findById(sortedNextRequests[0]._id)

                return Client.findById((firstOpenRequest).client)
            })
        },
        hasAnyRequests: async (parent, __, ___): Promise<Boolean> => {
            const countUndeletedRequests = parent.requestTypes.map(async (requestTypeEmbedding) => {
                const requestType = await RequestType.findById(requestTypeEmbedding._id)
                return requestType.requests.filter((requestEmbedding) => {
                    return requestEmbedding.deletedAt === undefined
                }).length
            }).reduce((total, openRequestsInRequestType) => total + openRequestsInRequestType, 0)

            return countUndeletedRequests > 0
        },
    }
}

export { resolvers }
