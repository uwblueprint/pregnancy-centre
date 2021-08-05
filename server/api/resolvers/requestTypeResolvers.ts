import { Request, RequestInterface } from "../../database/models/requestModel";
import { RequestGroup, RequestGroupInterface } from "../../database/models/requestGroupModel";
import { RequestType, RequestTypeInterface } from "../../database/models/requestTypeModel";

import { infoContainsOnlyFields } from "../utils/info";
import { sessionHandler } from "../utils/session";

const filterOpenRequestEmbeddings = (requestEmbeddings) => {
    return requestEmbeddings.filter((requestEmbedding) => {
        return requestEmbedding.deletedAt == null && requestEmbedding.fulfilledAt == null;
    });
};

const filterFulfilledRequestEmbeddings = (requestEmbeddings) => {
    return requestEmbeddings.filter((requestEmbedding) => {
        return requestEmbedding.deletedAt == null && requestEmbedding.fulfilledAt != null;
    });
};

// obtains embeddings of all deleted Request's
const filterDeletedRequestEmbeddings = (requestEmbeddings) => {
    return requestEmbeddings.filter((requestEmbedding) => {
        return requestEmbedding.deletedAt != null;
    });
};

const requestTypeEmbeddingFromRequestType = (requestType: RequestTypeInterface) => {
    return {
        _id: requestType._id
    };
};

const removeRequestTypeFromRequestGroup = async (requestTypeId, requestGroupId, session) => {
    const requestGroup = await RequestGroup.findById(requestGroupId).session(session);
    requestGroup.requestTypes = requestGroup.requestTypes.filter((requestEmbedding) => {
        return !requestEmbedding._id.equals(requestTypeId);
    });
    await requestGroup.save({ session: session });
};

const addRequestTypeToRequestGroup = async (requestType, requestGroupId, session) => {
    const newRequestGroup = await RequestGroup.findById(requestGroupId).session(session);
    newRequestGroup.requestTypes.push(requestTypeEmbeddingFromRequestType(requestType));
    await newRequestGroup.save({ session: session });
};

const swapRequestGroupForRequestType = async (requestType, oldRequestGroupID, newRequestGroupID, session) => {
    if (oldRequestGroupID) {
        await removeRequestTypeFromRequestGroup(requestType._id, oldRequestGroupID, session);
    }
    if (newRequestGroupID) {
        await addRequestTypeToRequestGroup(requestType, newRequestGroupID, session);
    }
};

const nextRequestEmbeddingForRequestType = (requestType, session) => {
    const filteredOpenRequests = filterOpenRequestEmbeddings(requestType.requests);

    if (filteredOpenRequests.length === 0) {
        return null;
    }

    // sort open requests in ascending order by creation date
    const sortedOpenRequests = filteredOpenRequests.sort((requestEmbedding1, requestEmbedding2) => {
        return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds();
    });

    return sortedOpenRequests[0];
};

const requestTypeQueryResolvers = {
    requestType: async (_, { _id }, ___): Promise<RequestTypeInterface> => {
        return RequestType.findById(_id).exec();
    },
    requestTypes: async (_, __, ___): Promise<Array<RequestTypeInterface>> => {
        return RequestType.find().exec();
    },
    requestTypesPage: async (_, { skip, limit }, __): Promise<Array<RequestTypeInterface>> => {
        return RequestType.find().sort({ name: "ascending", _id: "ascending" }).skip(skip).limit(limit).exec();
    },
    countRequestTypes: async (_, { open }, ___): Promise<number> => {
        if (open) {
            return RequestType.countDocuments({ deletedAt: { $exists: false } });
        } else {
            return RequestType.countDocuments();
        }
    }
    /* Left as a proof of concept:
    requestTypesFilter: async (_, { filter, options }, ___): Promise<Array<RequestTypeInterface>> => {
        return RequestType.find().exec()
    },*/
};

const requestTypeMutationResolvers = {
    createRequestType: async (_, { requestType }, { authenticateUser }): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const newRequestTypeObject = new RequestType({ ...requestType });
                const newRequestType = await newRequestTypeObject.save({ session: session });
                await addRequestTypeToRequestGroup(newRequestType, newRequestType.requestGroup, session);

                return newRequestType;
            });
        });
    },
    updateRequestType: async (_, { requestType }, { authenticateUser }): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const oldRequestType = await RequestType.findById(requestType._id).session(session);
                const newRequestType = await RequestType.findByIdAndUpdate(requestType._id, requestType, {
                    new: true,
                    session: session
                });
                if (!oldRequestType.requestGroup.equals(newRequestType.requestGroup)) {
                    await swapRequestGroupForRequestType(
                        newRequestType,
                        oldRequestType.requestGroup,
                        newRequestType.requestGroup,
                        session
                    );
                }
                return newRequestType;
            });
        });
    },
    deleteRequestType: async (_, { _id }, { authenticateUser }): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const requestType = await RequestType.findById(_id).session(session);

                if (requestType.deletedAt != null) return requestType.save({ session: session });

                requestType.deletedAt = new Date();

                for (let i = 0; i < requestType.requests.length; i++) {
                    const request = await Request.findById(requestType.requests[i]._id).session(session);

                    if (request.deletedAt != null) continue;

                    request.deletedAt = new Date();
                    requestType.requests[i].deletedAt = request.deletedAt;
                    await request.save({ session: session });
                }

                return requestType.save({ session: session });
            });
        });
    },
    changeRequestGroupForRequestType: async (
        _,
        { requestTypeId, requestGroupId },
        { authenticateUser }
    ): Promise<RequestTypeInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const modifiedRequestTypeObject = await RequestType.findById(requestTypeId).session(session);

                if (modifiedRequestTypeObject.requestGroup !== requestGroupId) {
                    await swapRequestGroupForRequestType(
                        modifiedRequestTypeObject,
                        modifiedRequestTypeObject.requestGroup,
                        requestGroupId,
                        session
                    );
                    modifiedRequestTypeObject.requestGroup = requestGroupId;
                }

                return modifiedRequestTypeObject.save({ session: session });
            });
        });
    }
};

const requestTypeResolvers = {
    requestGroup: async (parent, __, ___): Promise<RequestGroupInterface> => {
        return RequestGroup.findById(parent.requestGroup);
    },
    requests: async (parent, __, ___, info): Promise<Array<RequestInterface>> => {
        // if we only want fields in the embedding, then pass the embedding along
        if (infoContainsOnlyFields(info, ["_id", "createdAt", "deletedAt", "fulfilledAt"])) {
            return parent.requests;
        }

        // otherwise, get the underlying Requests from the database
        return parent.requests.map((requestEmbedding) => {
            return Request.findById(requestEmbedding._id);
        });
    },
    deleted: (parent, __, ___): boolean => {
        return parent.deletedAt != null;
    },
    openRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
        return filterOpenRequestEmbeddings(parent.requests).map((requestEmbedding) => {
            return Request.findById(requestEmbedding._id);
        });
    },
    fulfilledRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
        return filterFulfilledRequestEmbeddings(parent.requests).map((requestEmbedding) => {
            return Request.findById(requestEmbedding._id);
        });
    },
    deletedRequests: async (parent, __, ___): Promise<Array<RequestInterface>> => {
        return filterDeletedRequestEmbeddings(parent.requests).map((requestEmbedding) => {
            return Request.findById(requestEmbedding._id);
        });
    },
    countOpenRequests: (parent, __, ___): number => {
        return filterOpenRequestEmbeddings(parent.requests).length;
    },
    nextRequest: async (parent, __, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            const nextRequestEmbedding = await nextRequestEmbeddingForRequestType(parent, null);

            if (nextRequestEmbedding === null) {
                return null;
            }

            return Request.findById(nextRequestEmbedding._id);
        });
    },
    nextRecipient: async (parent, __, { authenticateUser }): Promise<string> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const nextRequestEmbedding = await nextRequestEmbeddingForRequestType(parent, null);

                if (nextRequestEmbedding === null) {
                    return null;
                }

                const nextRequest = await Request.findById(nextRequestEmbedding._id).session(session);
                return nextRequest.clientName;
            });
        });
    }
};

export {
    requestTypeQueryResolvers,
    requestTypeMutationResolvers,
    requestTypeResolvers,
    filterOpenRequestEmbeddings,
    nextRequestEmbeddingForRequestType
};
