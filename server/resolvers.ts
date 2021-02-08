const resolvers= {
    Query: {
        request: (_, { id }, { dataSources }) => dataSources.requests.getRequestById(id),
        requests: (_, __, { dataSources }) => dataSources.requests.getRequests()
    }
};

export { resolvers };
