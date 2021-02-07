const resolvers= {
    Query: {
        request: (_, { id }, { dataSources }) => dataSources.RequestAPI.getRequestById(id)
    }
};

export { resolvers };
