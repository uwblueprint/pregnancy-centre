const { gql } = require('apollo-server')

const typeDefs = gql`
    type Request {
        _id: ID
        request_id: String
        name: String
        description: String
        date_created: String
        archived: Boolean
        deleted: Boolean
        fulfilled: Boolean
        image: String
        priority: Int
        tags: [String]
        flags: [String]
    }
    type Query {
        request(id: ID): Request
    }
`;

module.exports = typeDefs;
