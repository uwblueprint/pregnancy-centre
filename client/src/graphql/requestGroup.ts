import { gql } from "@apollo/client";

export const createRequestGroupMutation = gql`
mutation CreateRequestGroup($name: String!, $description: String!, $image: String!) {
  createRequestGroup(requestGroup: {
    name: $name,
    description: $description,
    image: $image
  }) {
    success
    message
    id
  }
}`

export const updateRequestGroupMutation = gql`
mutation FetchRequestGroup($id: ID!, $requestTypes: [ID!]!) {
  updateRequestGroup(requestGroup: {
    id: $id,
    $name: String!, 
    $description: String!, $
    image: String!
    requestTypes: $requestTypes,
  }) {
    success
    message
    id
  }
}`
