const resolvers= {
    Query: {
        request: (_, { id }, { dataSources: { requests } }) => requests.getRequestById(id),
        requests: (_, __, { dataSources: { requests } }) => requests.getRequests()
    }
};

export { resolvers };
