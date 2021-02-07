const resolvers= {
    Query: {
        request: (_, { id }, { dataSources: { requests } }) => requests.getRequestById(id)
    }
};

export { resolvers };
