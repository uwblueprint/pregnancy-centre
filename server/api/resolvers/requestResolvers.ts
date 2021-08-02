import { Request, RequestInterface } from "../../database/models/requestModel";
import { RequestEmbeddingInterface, RequestType, RequestTypeInterface } from "../../database/models/requestTypeModel";

import { sessionHandler } from "../utils/session";

const requestEmbeddingFromRequest = (request: RequestInterface) => {
    return {
        _id: request._id,
        createdAt: request.createdAt ? request.createdAt : null,
        deletedAt: request.deletedAt ? request.deletedAt : null,
        fulfilledAt: request.fulfilledAt ? request.fulfilledAt : null
    };
};

const swapRequestTypeForRequest = async (request, oldRequestTypeID, newRequestTypeID, session) => {
    if (oldRequestTypeID) {
        const oldRequestType = await RequestType.findById(oldRequestTypeID).session(session);
        oldRequestType.requests = oldRequestType.requests.filter((requestEmbedding) => {
            return !requestEmbedding._id.equals(request._id);
        });
        await oldRequestType.save({ session: session });
    }

    const newRequestType = await RequestType.findById(newRequestTypeID).session(session);
    newRequestType.requests.push(requestEmbeddingFromRequest(request));
    await newRequestType.save({ session: session });
};

const updateRequestEmbedingInRequestTypes = async (request, session) => {
    const requestType = await RequestType.findById(request.requestType).session(session);
    requestType.requests = requestType.requests.map((requestEmbedding: RequestEmbeddingInterface) =>
        requestEmbedding._id.equals(request._id) ? requestEmbeddingFromRequest(request) : requestEmbedding
    );
    await requestType.save({ session: session });
};

const requestQueryResolvers = {
    request: async (_, { _id }, ___): Promise<RequestInterface> => {
        return Request.findById(_id).exec();
    },
    requests: async (_, __, ___): Promise<Array<RequestInterface>> => {
        return Request.find().exec();
    },
    requestsPage: async (_, { skip, limit }, __): Promise<Array<RequestInterface>> => {
        return Request.find().sort({ name: "ascending", _id: "ascending" }).skip(skip).limit(limit).exec();
    },
    countRequests: async (_, { open }, ___): Promise<number> => {
        if (open) {
            return Request.countDocuments({ deletedAt: { $exists: false }, fulfilledAt: { $exists: false } });
        } else {
            return Request.countDocuments();
        }
    }
    /* Left as a proof of concept:
    requestsFilter: async (_, { filter, options }, ___): Promise<Array<RequestInterface>> => {
        return Request.find().exec()
    },*/
};

const requestMutationResolvers = {
    createRequest: async (_, { request }, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const newRequestObject = new Request({ ...request });
                const newRequest = await newRequestObject.save({ session: session });

                const requestType = await RequestType.findById(newRequest.requestType).session(session);
                requestType.requests.push(requestEmbeddingFromRequest(newRequest));
                await requestType.save({ session: session });

                return newRequest;
            });
        });
    },
    updateRequest: async (_, { request }, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const oldRequest = await Request.findById(request._id).session(session);
                const newRequest = await Request.findByIdAndUpdate(request._id, request, {
                    new: true,
                    session: session
                });
                if (!oldRequest.requestType.equals(newRequest.requestType)) {
                    await swapRequestTypeForRequest(
                        newRequest,
                        oldRequest.requestType,
                        newRequest.requestType,
                        session
                    );
                }
                return newRequest;
            });
        });
    },
    updateRequests: async (_, { requests }, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const newRequests = [];
                for (const request of requests){
                    newRequests.push(await Request.findByIdAndUpdate(request._id, {...request}, {
                        new: true,
                        session: session
                    }))
                }
                return newRequests;
            });
        });
    },
    deleteRequest: async (_, { _id }, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const request = await Request.findById(_id);
                request.deletedAt = new Date();
                await updateRequestEmbedingInRequestTypes(request, session);
                return request.save({ session: session });
            });
        });
    },
    fulfillRequest: async (_, { _id }, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const request = await Request.findById(_id);
                request.fulfilledAt = new Date();
                await updateRequestEmbedingInRequestTypes(request, session);
                return request.save({ session: session });
            });
        });
    },
    unfulfillRequest: async (_, { _id }, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const request = await Request.findById(_id);
                request.fulfilledAt = undefined;
                await updateRequestEmbedingInRequestTypes(request, session);
                return request.save({ session: session });
            });
        });
    },
    changeRequestTypeForRequest: async (
        _,
        { requestId, requestTypeId },
        { authenticateUser }
    ): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const modifiedRequestObject = await Request.findById(requestId).session(session);

                if (modifiedRequestObject.requestType !== requestTypeId) {
                    await swapRequestTypeForRequest(
                        modifiedRequestObject,
                        modifiedRequestObject.requestType,
                        requestTypeId,
                        session
                    );
                    modifiedRequestObject.requestType = requestTypeId;
                }

                return modifiedRequestObject.save({ session: session });
            });
        });
    }
};

const requestResolvers = {
    requestType: async (parent, __, ___): Promise<RequestTypeInterface> => {
        return RequestType.findById(parent.requestType);
    },
    deleted: (parent, __, ___): boolean => {
        return parent.deletedAt != null;
    },
    fulfilled: (parent, __, ___): boolean => {
        return parent.fulfilledAt != null;
    },
    clientName: async (parent, _, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return parent.clientName;
        });
    }
};

export { requestQueryResolvers, requestMutationResolvers, requestResolvers };
