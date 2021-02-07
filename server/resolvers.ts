module.exports = {
    Query: {
        request: (_, { id }, { dataSources }) => dataSources.RequestAPI.getRequestById(id)
    }
}
