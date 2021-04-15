import { gql, useMutation } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";

import { Button } from '../atoms/Button'
import FormModal from './FormModal'
import RequestGroup from '../../data/types/requestGroup'
import RequestType from '../../data/types/requestType'
import { TextField } from '../atoms/TextField'


interface Props {
  handleClose: () => void
  onSubmit: (newRequestTypeName: string) => void
  requestType?: RequestType
  requestGroup: RequestGroup
  operation: "create" | "edit"
}

const RequestTypeForm: FunctionComponent<Props> = (props: Props) => {
  const [requestTypeError, setRequestTypeError] = useState("")
  const [requestType, setRequestType] = useState(props.requestType && props.requestType.name ? props.requestType.name : "")
  const requestTypesSet = new Set(props.requestGroup.requestTypes
    ? props.requestGroup.requestTypes.map((requestType) => requestType.name)
    : [])

  const createForm = props.operation === "create";

  const createRequestTypeMutation = gql`
  mutation CreateRequestType(
    $name: String!
    $requestGroup: ID!
  ) {
    createRequestType(requestType: { 
      name: $name 
      requestGroup: $requestGroup
    }) {
      success
      message
      id
    }
  }`

  const updateRequestTypeMutation = gql`
  mutation UpdateRequestType(
    $id: ID!
    $name: String!
  ) {
    updateRequestType(requestType: {
      id: $id
      name: $name
    }) {
      success
      message
      id
    }
  }`

  const [createRequestType] = useMutation(createRequestTypeMutation);
  const [updateRequestType] = useMutation(updateRequestTypeMutation);

  const updateRequestTypeError = (newRequestTypeName: string) => {
    let error = ""

    if (newRequestTypeName.length > 40) {
      error = "Type name cannot exceed 40 characters"
    }
    else if (!newRequestTypeName) {
      error = "You need to enter a name for the type"
    }
    else if ((!props.requestType || newRequestTypeName !== props.requestType.name)
      && requestTypesSet.has(newRequestTypeName)) {
      error = "There is already a type with this name"
    }

    setRequestTypeError(error)
    return error
  }

  const onRequestTypeChange = (newRequestTypeName: string) => {
    setRequestType(newRequestTypeName)
    updateRequestTypeError(newRequestTypeName)
  }


  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempRequestTypeError = updateRequestTypeError(requestType)

    if (!tempRequestTypeError) {
      if (createForm) {

        createRequestType({
          variables: {
            name: requestType,
            requestGroup: props.requestGroup._id
          }
        }).then((res) => { console.log(res) })
          .catch((err) => { console.log(err) })

      }
      else {
        // Edit request type
        if (props.requestType) {
          updateRequestType({
            variables: {
              id: props.requestType._id,
              name: requestType,
            }
          }).then((res) => { console.log(res) })
            .catch((err) => { console.log(err) })
        }
      }
      props.onSubmit(requestType)
    }
  }


  const formTitle = createForm ? "Create Type" : "Edit Type";
  const formButtonText = createForm ? "Create type" : "Edit type";

  return <FormModal
    class="request-type-form-modal"
    size="small"
    title={formTitle}
    handleClose={props.handleClose}
    show={true}
  >
    <form onSubmit={onSubmit}>
      <div className="request-type-form-modal-content">
        {createForm && <span>Create a new item type within the group Bottles</span>}
        <div className="form-item">
          <TextField
            input={requestType}
            isDisabled={false}
            isErroneous={requestTypeError !== ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { onRequestTypeChange(e.target.value) }}
            name="request-type"
            placeholder="Type name (e.g. small, 500ml, toddler)"
            type="text"
          />
          {requestTypeError && <span className="error-message">{requestTypeError}</span>}
        </div>
      </div>
      <div className="request-type-form-modal-footer">
        <Button
          text={formButtonText}
          copyText=""
        />
      </div>
    </form>
  </FormModal>
};

export default RequestTypeForm;
