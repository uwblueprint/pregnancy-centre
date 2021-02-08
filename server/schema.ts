import { gql } from 'apollo-server';

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
        tags: [Tag]
    }
    type Query {
        request(id: ID): Request
        requests: [Request]
    }
    type Tag {
        _id: ID
        type: String
        value: String
    }
`;



export { typeDefs };
