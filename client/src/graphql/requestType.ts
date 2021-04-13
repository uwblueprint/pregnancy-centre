import { gql } from "@apollo/client";

export const createRequestTypeMutation = gql`
  mutation CreateRequestType($name: String!, $requestGroupId: ID!) {
    createRequestType(requestType: {
      name: $name,
      requestGroup: $requestGroupId,
    }) {
      success
      message
      id
    }
  }`

export const deleteRequestTypeMutation = gql`
  mutation DeleteRequestType($id: ID!) {
    deleteRequestType(id: $id) {
      success
      message
      id
    }
  }`

