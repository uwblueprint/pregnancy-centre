import { Request, RequestInterface } from "../../database/models/requestModel";
import { RequestEmbeddingInterface, RequestType, RequestTypeInterface } from "../../database/models/requestTypeModel";
import { RequestGroup, RequestGroupInterface } from "../../database/models/requestGroupModel";

import { DonationForm, DonationFormInterface } from "../../database/models/donationFormModel";
import { filterOpenRequestEmbeddings, nextRequestEmbeddingForRequestType } from "./requestTypeResolvers";

import { infoContainsOnlyFields } from "../utils/info";
import { sessionHandler } from "../utils/session";

const nextRequestEmbeddingForRequestGroup = async (requestGroup, session) => {
    const nextRequestsForAllRequestTypes: Array<RequestEmbeddingInterface> = await Promise.all(
        requestGroup.requestTypes.map(async (requestTypeEmbedding) => {
            const requestType = await RequestType.findById(requestTypeEmbedding._id).session(session);
            return nextRequestEmbeddingForRequestType(requestType, session);
        })
    );

    if (nextRequestsForAllRequestTypes === null) {
        return null;
    }

    const sortedNextRequests = nextRequestsForAllRequestTypes.sort((requestEmbedding1, requestEmbedding2) => {
        if (requestEmbedding1 === null) {
            return 1;
        }

        if (requestEmbedding2 === null) {
            return -1;
        }

        return requestEmbedding1.createdAt.getMilliseconds() - requestEmbedding2.createdAt.getMilliseconds();
    });

    if (sortedNextRequests.length === 0) {
        return null;
    }

    return sortedNextRequests[0];
};

const requestGroupQueryResolvers = {
    requestGroup: async (_, { _id }, ___): Promise<RequestGroupInterface> => {
        return RequestGroup.findById(_id).exec();
    },
    requestGroups: async (_, __, ___): Promise<Array<RequestGroupInterface>> => {
        return RequestGroup.find().exec();
    },
    requestGroupsPage: async (_, { skip, limit, name, open }, __): Promise<Array<RequestGroupInterface>> => {
        const filter: {[key: string]: any} = {};
        if (name) {
            filter.name = { $regex: "^" + name + ".*", $options: "i" };
        }
        if (open) {
            filter.deletedAt = { $eq: null };
        }
        return RequestGroup.find(filter).sort({ name: "ascending", _id: "ascending" }).skip(skip).limit(limit).exec();
    },
    countRequestGroups: async (_, { open, name }, ___): Promise<number> => {
        const filter: {[key: string]: any} = {};
        if (name) {
            filter.name = { $regex: "^" + name + ".*", $options: "i" };
        }
        if (open) {
            filter.deletedAt = { $eq: null };
        }
        return RequestGroup.countDocuments(filter);
    }
    /* Left as a proof of concept:
    requestGroupsFilter: async (_, { filter, options }, ___): Promise<Array<RequestGroupInterface>> => {
        return RequestGroup.find().exec()
    },*/
};

const requestGroupMutationResolvers = {
    createRequestGroup: async (_, { requestGroup }, { authenticateUser }): Promise<RequestGroupInterface> => {
        return authenticateUser().then(async () => {
            return new RequestGroup({ ...requestGroup }).save();
        });
    },
    updateRequestGroup: async (_, { requestGroup }, { authenticateUser }): Promise<RequestGroupInterface> => {
        return authenticateUser().then(async () => {
            return RequestGroup.findByIdAndUpdate(requestGroup._id, requestGroup, { lean: true });
        });
    },
    deleteRequestGroup: async (_, { _id }, { authenticateUser }): Promise<RequestGroupInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const requestGroup = await RequestGroup.findById(_id).session(session);

                if (requestGroup == null) return requestGroup;

                if (requestGroup.deletedAt != null) return requestGroup.save({ session: session });

                requestGroup.deletedAt = new Date();

                for (const requestTypeEmbedding of requestGroup.requestTypes) {
                    const requestType = await RequestType.findById(requestTypeEmbedding._id).session(session);

                    if (requestType.deletedAt != null) continue;

                    requestType.deletedAt = new Date();
                    await requestType.save({ session: session });

                    for (let i = 0; i < requestType.requests.length; i++) {
                        const request = await Request.findById(requestType.requests[i]._id).session(session);

                        if (request.deletedAt != null) continue;

                        request.deletedAt = new Date();
                        requestType.requests[i].deletedAt = request.deletedAt;
                        await request.save({ session: session });
                    }
                }

                return requestGroup.save({ session: session });
            });
        });
    }
};

const requestGroupResolvers = {
    requestTypes: async (parent, __, ___, info): Promise<Array<RequestTypeInterface>> => {
        // if we only want fields in the embedding, then pass the embedding along
        if (infoContainsOnlyFields(info, ["_id", "name", "deletedAt"])) {
            return parent.requestTypes;
        }

        // otherwise, get the underlying Requests from the database
        return parent.requestTypes.map((requestTypeEmbedding) => {
            return RequestType.findById(requestTypeEmbedding._id);
        });
    },
    donationForms: async (parent, __, ___, info): Promise<Array<DonationFormInterface>> => {
        if (infoContainsOnlyFields(info, ["_id"])) {
            return parent.donationForms;
        }

        return parent.donationForms.map((donationFormEmbedding) => {
            return DonationForm.findById(donationFormEmbedding._id);
        });
    },
    deleted: (parent, __, ___): boolean => {
        return parent.deletedAt != null;
    },
    countOpenRequests: async (parent, __, ___): Promise<number> => {
        const countOpenRequestsPerType: Array<number> = await Promise.all(
            parent.requestTypes.map(async (requestTypeEmbedding) => {
                const requestType = await RequestType.findById(requestTypeEmbedding._id);
                if (requestType.deletedAt != null) {
                    return 0;
                }
                return filterOpenRequestEmbeddings(requestType.requests).length;
            })
        );

        return countOpenRequestsPerType.reduce(
            (total: number, openRequestsInRequestType: number) => total + openRequestsInRequestType,
            0
        );
    },
    nextRequest: async (parent, __, { authenticateUser }): Promise<RequestInterface> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const nextRequestEmbedding = await nextRequestEmbeddingForRequestGroup(parent, session);

                if (nextRequestEmbedding === null) {
                    return null;
                }

                return Request.findById(nextRequestEmbedding._id).session(session);
            });
        });
    },
    nextRecipient: async (parent, __, { authenticateUser }): Promise<string> => {
        return authenticateUser().then(async () => {
            return sessionHandler(async (session) => {
                const nextRequestEmbedding = await nextRequestEmbeddingForRequestGroup(parent, session);

                if (nextRequestEmbedding === null) {
                    return null;
                }

                const nextRequest = await Request.findById(nextRequestEmbedding._id).session(session);

                return nextRequest.clientName;
            });
        });
    },
    hasAnyRequests: async (parent, __, ___): Promise<boolean> => {
        return sessionHandler(async (session) => {
            const countUndeletedRequestsPerType: Array<number> = await Promise.all(
                parent.requestTypes.map(async (requestTypeEmbedding) => {
                    const requestType = await RequestType.findById(requestTypeEmbedding._id).session(session);
                    return requestType.requests.filter((requestEmbedding) => {
                        return requestEmbedding.deletedAt == null;
                    }).length;
                })
            );

            const countUndeletedRequests = countUndeletedRequestsPerType.reduce(
                (total, openRequestsInRequestType) => total + openRequestsInRequestType,
                0
            );

            return countUndeletedRequests > 0;
        });
    }
};

export { requestGroupQueryResolvers, requestGroupMutationResolvers, requestGroupResolvers };
