import { gql } from 'apollo-server';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

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
        tags: [Tag]
    }
    type Query {
        request(id: ID): Request
        requests: [Request]
    }
    type Tag {
        type: String
        value: String
    }
`;



export { typeDefs };
