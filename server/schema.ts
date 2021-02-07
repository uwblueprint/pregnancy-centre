const { gql } = require('apollo-server')
const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')

const typeDefs = gql`
    type Request {
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
    }
    type Query {
        request(id: ID): Request
    }
`;

module.exports = typeDefs;
