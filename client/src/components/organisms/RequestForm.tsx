import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';

import AlertDialog from '../atoms/AlertDialog'
import { Button } from '../atoms/Button'
import Client from '../../data/types/client'
import FormItem from '../molecules/FormItem'
import FormModal from './FormModal'
import Request from '../../data/types/request'
import RequestGroup from '../../data/types/requestGroup'
import RequestType from '../../data/types/requestType'
import SearchableDropdown from '../atoms/SearchableDropdown'
import { TextField } from '../atoms/TextField'


interface Props {
  handleClose: () => void
  requestId?: string
  operation: "create" | "edit"
}

const RequestGroupForm: FunctionComponent<Props> = (props: Props) => {
  const [initialRequest, setInitialRequest] = useState<Request | null>(null)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [changeMade, setChangeMade] = useState(false)
  const [requestGroupsMap, setRequestGroupsMap] = useState<Map<string, RequestGroup> | null>(null)
  const [requestTypesMap, setRequestTypesMap] = useState<Map<string, RequestType> | null>(null)
  const [requestGroup, setRequestGroup] = useState<RequestGroup | null>(null)
  const [requestType, setRequestType] = useState<RequestType | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [clientName, setClientName] = useState("")
  const [requestGroupError, setRequestGroupError] = useState("")
  const [requestTypeError, setRequestTypeError] = useState("")
  const [clientNameError, setClientNameError] = useState("")
  const [loading, setLoading] = useState(true)

  const createRequestMutation = gql`
  mutation CreateRequest(
    $requestType: ID!
    $quantity: Int!
    $clientName: ID!
  ) {
    createRequest(request: {
      name: $name
      description: $description
      image: $image
      requestTypeNames: $requestTypeNames
      client: $client
    }) {
      success
      message
      id
    }
  }`

  const updateRequestMutation = gql`
  mutation UpdateRequest(
    $id: ID!
    $requestType: ID!
    $quantity: Int!
    $client: ID!
    $clientName: ID!
  ) {
    updateRequest(request: {
      id: $id
      requestType: $requestType
      quantity: $quantity
      client: $client
      clientName: $clientName
    }) {
      success
      message
      id
    }
  }`

  const updateRequestWithDifferentClientMutation = gql`
  mutation UpdateRequest(
    $id: ID!
    $requestType: ID!
    $quantity: Int!
    $clientName: ID!
  ) {
    updateRequest(request: {
      id: $id
      requestType: $requestType
      quantity: $quantity
      clientName: $clientName
    }) {
      success
      message
      id
    }
  }`

  // const fetchMatchingClientsQuery = gql`
  // query FetchClients(
  //   $fullname: String!
  // ) {
  //   filterClients(client: {
  //     fullname: $fullname
  //   }) {
  //     client {
  //       _id
  //     }
  //   }
  // }`

  // const getRequestTypesInRequestGroup = gql`
  // query FetchRequestGroup($id: ID!) {
  //   requestGroup(id: $id) {
  //     requestTypes {
  //       _id
  //       name
  //       deleted
  //     }
  //   }
  // }
  // `

  const [createRequest] = useMutation(createRequestMutation);
  const [updateRequest] = useMutation(updateRequestMutation);
  const [updateRequestWithDifferentClient] = useMutation(updateRequestWithDifferentClientMutation);
  // const [fetchMatchingClients, { data: matchingClients, loading: loadingMatchingClients, error: matchingClientsError }] = useLazyQuery(fetchMatchingClientsQuery);


  const fetchRequestGroups = gql`
  query FetchRequestGroups {
    requestGroups {
      _id
      name
      requestTypes {
        _id
        name
      }
    }
  }`

  useQuery(fetchRequestGroups, {
    fetchPolicy: 'network-only',
    onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
      const requestGroups: Array<RequestGroup> = JSON.parse(JSON.stringify(data.requestGroups)); // deep-copy since data object is frozen

      setRequestGroupsMap(new Map(
        requestGroups.reduce((entries, requestGroup) => {
          if (requestGroup && requestGroup.name) {
            entries.push([requestGroup.name, requestGroup])
          }
          return entries
        },
          [] as Array<[string, RequestGroup]>))
      )

      // For the edit request form, check that we're not waiting for the request to load before setting loading = false
      if (!(props.operation === 'edit' && !initialRequest)) {
        setLoading(false)
      }
    }
  });

  // useEffect(() => {
  //   if (!loadingRequestGroups && ) {
  //     setLoadingRequest(false)
  //   }
  // }, [loadingRequestGroups])

  const fetchRequest = gql`
  query FetchRequest($id: ID!) {
    request(id: $id) {
      _id
      quantity
      requestType {
        _id
        name
        requestGroup {
          _id
          name
        }
      }
      client {
        _id
        name
      }
    }
  }`

  if (props.operation === "edit") {
    useQuery(fetchRequest, {
      variables: { id: props.requestId, },
      fetchPolicy: 'network-only',
      onCompleted: (data: { rawRequest: Request }) => {
        const request: Request = JSON.parse(JSON.stringify(data.rawRequest)); // deep-copy since data object is frozen

        setInitialRequest(request)
        setRequestGroup(request.requestType && request.requestType.requestGroup ? request.requestType.requestGroup : null)
        setRequestType(request.requestType ? request.requestType : null)
        setQuantity(request.quantity ? request.quantity : 1)
        setClientName(request.client && request.client.fullName ? request.client.fullName : "")

        // Check that requestGroups are loaded before setting loading = false
        if (requestGroupsMap) {
          setLoading(false)
        }
      }
    });

    useEffect(() => {
      if (requestGroupsMap
        && initialRequest
        && initialRequest.requestType
        && initialRequest.requestType.requestGroup
        && initialRequest.requestType.requestGroup.requestTypes
      ) {
        updateRequestTypesMap(initialRequest.requestType.requestGroup.requestTypes);
      }
    }, [requestGroupsMap, initialRequest])
  }

  /* Functions for RequestTypesMap */
  const updateRequestTypesMap = (requestTypes: Array<RequestType>) => {
    setRequestTypesMap(new Map(
      requestTypes.reduce((entries, requestType) => {
        if (requestType && requestType.name) {
          entries.push([requestType.name, requestType])
        }
        return entries
      },
        [] as Array<[string, RequestType]>)
    ))
  }

  /* Functions for Request's RequestGroup */
  const updateRequestGroupError = (requestGroup: RequestGroup | null | undefined): string => {
    let error = ""
    if (!requestGroup) {
      error = "Please select a group";
    }

    setRequestGroupError(error)
    return error;
  }

  const onRequestGroupChange = (newRequestGroupName: string) => {
    if (!requestGroupsMap) return;
    const newRequestGroup = requestGroupsMap.get(newRequestGroupName);

    setChangeMade(true);
    updateRequestGroupError(newRequestGroup);
    setRequestGroup(newRequestGroup ? newRequestGroup : null);

    if (newRequestGroup
      && (!requestGroup || newRequestGroupName !== requestGroup.name)
      && newRequestGroup.requestTypes) {
      // If a new request group is chosen, change the request types map
      updateRequestTypesMap(newRequestGroup.requestTypes);
    }
  }

  /* Functions for Request's RequestType */

  const updateRequestTypeError = (requestType: RequestType | null | undefined): string => {
    let error = ""

    // Error if requestTypesMap is loaded and no requestType is chosen
    if (!requestType && requestTypesMap) {
      error = "Please select a type";
    }

    setRequestTypeError(error);
    return error;
  }

  const onRequestTypeChange = (newRequestTypeName: string) => {
    if (!requestTypesMap) return;
    const newRequestType = requestTypesMap.get(newRequestTypeName)

    setChangeMade(true);
    updateRequestTypeError(newRequestType)
    return true;
  }

  /* Functions for Request's Quantity */
  // const updateQuantityError = (quantity: number) => {
  //   let error = ""
  //   if (!description) {
  //     error = "Please enter a description";
  //   }

  //   setDescriptionError(error)
  //   return error;
  // }

  const onQuantityChange = (newQuantity: number) => {
    setChangeMade(true);
    setQuantity(newQuantity)
    // updateDescriptionError(description)
  }

  /* Functions for Request's Client */
  const updateClientNameError = (clientName: string) => {
    let error = ""
    if (clientName === "") {
      error = "Please enter a first name";
    }

    setClientNameError(error)
    return error;
  }

  const onClientNameChange = (newClientName: string) => {
    setChangeMade(true);
    updateClientNameError(newClientName)
    setClientName(newClientName)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempRequestGroupError = updateRequestGroupError(requestGroup)
    const tempRequestTypeError = updateRequestTypeError(requestType)
    const tempClientNameError = updateClientNameError(clientName)

    if (!tempRequestGroupError && !tempRequestTypeError && !tempClientNameError) {
      props.handleClose()
    }

    // if (!tempRequestGroupError && !tempRequestTypeError && !tempClientNameError) {
    //   // fetchClients({ variables: { fullName: clientName } }).then(() => {
    //   //   if (props.operation === "create") {
    //   //     return createRequest({ variables: { name, description, image, requestTypeNames } })
    //   //   }
    //   //   return updateRequest({ variables: { id: props.requestGroupId, name, description, image, requestTypeNames } })
    //   // }).catch((err) => { console.log(err) })
    //   if (props.operation === "create") {
    //     createRequest({
    //       variables: {
    //         requestType: requestType._id,
    //         quantity,
    //         clientName
    //       }
    //     })
    //       .catch((err) => { console.log(err) })
    //   }
    //   else {
    //     // Edit request
    //     const clientChanged = !(clientName === initialRequest.client.fullName)
    //     updateRequest({
    //       variables: {
    //         id: initialRequest._id,
    //         requestType: requestType._id,
    //         quantity,
    //         client: !clientChanged ? initialRequest.client._id : undefined,
    //         clientName: clientChanged ? clientName : undefined,
    //       }
    //     })
    //       .catch((err) => { console.log(err) })

    //     // if (clientName === initialRequest.client.fullName) {
    //     //   // Client on request is unchanged
    //     //   updateRequest({
    //     //     variables: {
    //     //       id: initialRequest._id,
    //     //       requestType: requestType._id,
    //     //       quantity,
    //     //       client: initialRequest.client._id
    //     //     }
    //     //   })
    //     //     .catch((err) => { console.log(err) })
    //     // } else {
    //     //   updateRequest({
    //     //     variables: {
    //     //       id: initialRequest._id,
    //     //       requestType: requestType._id,
    //     //       quantity,
    //     //       clientName
    //     //     }
    //     //   })
    //     //     .catch((err) => { console.log(err) })
    //     // }
    //   }


    //   props.handleClose()
    // }
  }

  const handleClose = () => {
    if (changeMade) {
      setShowAlertDialog(true);
    }
    else {
      props.handleClose();
    }
  }


  const formTitle = props.operation === "create" ? "Create Request" : "Edit Request";
  const formButtonText = props.operation === "create" ? "Create request" : "Edit request";

  return <div className="request-form">
    <FormModal
      class="request-form-modal"
      show={true}
      handleClose={handleClose}
      title={formTitle}
      size="medium">
      {showAlertDialog &&
        <AlertDialog
          dialogText="This request has not been created yet."
          onExit={props.handleClose}
          onStay={() => { setShowAlertDialog(false) }} />
      }
      {loading
        ? <div className="request-form-modal-loading-content">
          <div className="spinner">
            <Spinner animation="border" role="status" />
          </div>
        </div>
        : <form onSubmit={onSubmit} className="request-form-modal-content">
          <div className="searchable-dropdown-form-item">
            <FormItem
              formItemName="Group"
              errorString={requestGroupError}
              isDisabled={false}
              tooltipText="Groups describe the overall category of an item, such as stroller, crib, or bed."
              inputComponent={
                <SearchableDropdown
                  placeholderText="Select a group"
                  searchPlaceholderText="Search for a group"
                  dropdownItems={requestGroupsMap ? Object.keys(requestGroupsMap) : []} // Pass the name of all request groups
                  isErroneous={requestGroupError !== ""}
                  isDisabled={false}
                  onSelect={onRequestGroupChange}
                />
              }
            />
          </div>
          <div className="searchable-tag-dropdown-form-item">
            <FormItem
              formItemName="Type"
              errorString={requestTypeError}
              isDisabled={requestGroup === null} // Enable request type dropdown if a request group is selected
              tooltipText="Types describe more specific information about a request, such as size, capacity, or intended child age."
              inputComponent={
                <SearchableDropdown
                  placeholderText={requestGroup === null ? "Select a group first" : "Search or create a type"}
                  searchPlaceholderText="Search for a type"
                  dropdownItems={requestTypesMap ? Object.keys(requestTypesMap) : []} // Pass the name of all request groups
                  isErroneous={requestTypeError !== ""}
                  isDisabled={requestGroup === null}
                  onSelect={onRequestTypeChange}
                />
              }
            />
          </div>
          <div className="infinite-dropdown-form-item">
            <FormItem
              formItemName="Quantity"
              errorString="" // No errors for quantity
              isDisabled={false}
              inputComponent={
                <TextField
                  input={quantity.toString()}
                  isDisabled={false}
                  isErroneous={false}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onQuantityChange(parseInt(e.target.value))}
                  name="quantity"
                  placeholder=""
                  type="text"
                />
              }
            />
          </div>
          <div className="text-field-form-item">
            <FormItem
              formItemName="Client Full Name"
              errorString={clientNameError}
              isDisabled={false}
              inputComponent={
                <TextField
                  input={clientName}
                  isDisabled={false}
                  isErroneous={clientNameError !== ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onClientNameChange(e.target.value)}
                  name="client-name"
                  placeholder="ex. Julia Michaels"
                  type="text"
                />
              }
            />
          </div>
          <div className="request-form-modal-footer">
            <Button
              text={formButtonText}
              copyText=""
            />
          </div>
        </form>}
    </FormModal>
  </div >
};

export default RequestGroupForm;
