import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

import AlertDialog from "../atoms/AlertDialog";
import { Button } from "../atoms/Button";
import FormItem from "../molecules/FormItem";
import FormModal from "./FormModal";
import Request from "../../data/types/request";
import RequestGroup from "../../data/types/requestGroup";
import RequestType from "../../data/types/requestType";
import SearchableDropdown from "../atoms/SearchableDropdown";
import { TextField } from "../atoms/TextField";

interface Props {
  handleClose: () => void;
  onSubmitComplete: () => void;
  requestId?: string;
  operation: "create" | "edit";
}

const RequestGroupForm: FunctionComponent<Props> = (props: Props) => {
  const [initialRequest, setInitialRequest] = useState<Request | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [changeMade, setChangeMade] = useState(false);
  const [requestGroupsMap, setRequestGroupsMap] = useState<Map<
    string,
    RequestGroup
  > | null>(null);
  const [requestTypesMap, setRequestTypesMap] = useState<Map<
    string,
    RequestType
  > | null>(null);
  const [requestGroup, setRequestGroup] = useState<RequestGroup | null>(null);
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [requestGroupInput, setRequestGroupInputGroup] = useState("");
  const [requestTypeInput, setRequestTypeInputGroup] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [clientName, setClientName] = useState("");
  const [requestGroupError, setRequestGroupError] = useState("");
  const [requestTypeError, setRequestTypeError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  const [clientNameError, setClientNameError] = useState("");
  const [loading, setLoading] = useState(true);

  const createRequestMutation = gql`
    mutation CreateRequest(
      $requestType: ID!
      $quantity: Int!
      $clientName: String!
    ) {
      createRequest(
        request: {
          requestType: $requestType
          quantity: $quantity
          clientFullName: $clientName
        }
      ) {
        success
        message
        id
      }
    }
  `;

  const updateRequestMutation = gql`
    mutation UpdateRequest(
      $id: ID!
      $requestType: ID!
      $quantity: Int!
      $clientName: String!
    ) {
      updateRequest(
        request: {
          id: $id
          requestType: $requestType
          quantity: $quantity
          clientFullName: $clientName
        }
      ) {
        success
        message
        id
      }
    }
  `;

  const [createRequest] = useMutation(createRequestMutation, {
    onCompleted: () => {
      props.onSubmitComplete();
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const [updateRequest] = useMutation(updateRequestMutation, {
    onCompleted: () => {
      props.onSubmitComplete();
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
    }
  `;

  useQuery(fetchRequestGroups, {
    fetchPolicy: "network-only",
    onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
      const requestGroups: Array<RequestGroup> = JSON.parse(
        JSON.stringify(data.requestGroups)
      ); // deep-copy since data object is frozen

      const map = new Map(
        requestGroups.reduce((entries, requestGroup) => {
          if (requestGroup && requestGroup.name) {
            entries.push([requestGroup.name, requestGroup]);
          }
          return entries;
        }, [] as Array<[string, RequestGroup]>)
      );
      setRequestGroupsMap(map);

      // For the edit request form, check that we're not waiting for the request to load before setting loading = false
      if (!(props.operation === "edit" && !initialRequest)) {
        setLoading(false);
      }
    },
  });

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
          fullName
        }
      }
    }
  `;

  if (props.operation === "edit") {
    useQuery(fetchRequest, {
      variables: { id: props.requestId },
      fetchPolicy: "network-only",
      onCompleted: (data: { request: Request }) => {
        const request: Request = JSON.parse(JSON.stringify(data.request)); // deep-copy since data object is frozen

        setInitialRequest(request);
        setRequestGroup(
          request.requestType && request.requestType.requestGroup
            ? request.requestType.requestGroup
            : null
        );
        setRequestType(request.requestType ? request.requestType : null);
        setQuantity(request.quantity ? request.quantity : 1);
        setClientName(
          request.client && request.client.fullName
            ? request.client.fullName
            : ""
        );

        // Check that requestGroups are loaded before setting loading = false
        if (requestGroupsMap) {
          setLoading(false);
        }
      },
    });

    useEffect(() => {
      if (
        requestGroupsMap &&
        initialRequest &&
        initialRequest.requestType &&
        initialRequest.requestType.requestGroup &&
        initialRequest.requestType.requestGroup.name
      ) {
        // When all request groups and the initial request is fetched, construct requestTypesMap
        const initialRequestGroupRequestTypes = requestGroupsMap.get(
          initialRequest.requestType.requestGroup.name
        )?.requestTypes;
        if (initialRequestGroupRequestTypes) {
          updateRequestTypesMap(initialRequestGroupRequestTypes);
        }
      }
    }, [requestGroupsMap, initialRequest]);
  }

  /* Functions for RequestTypesMap */
  const updateRequestTypesMap = (requestTypes: Array<RequestType>) => {
    setRequestTypesMap(
      new Map(
        requestTypes.reduce((entries, requestType) => {
          if (requestType && requestType.name) {
            entries.push([requestType.name, requestType]);
          }
          return entries;
        }, [] as Array<[string, RequestType]>)
      )
    );
  };

  /* Functions for Request's RequestGroup */
  const updateRequestGroupError = (
    requestGroup: RequestGroup | null | undefined
  ): string => {
    let error = "";
    if (!requestGroup) {
      error = "Please select a group";
    }

    setRequestGroupError(error);
    return error;
  };

  const onRequestGroupChange = (newRequestGroupName: string) => {
    if (!requestGroupsMap) return;
    const newRequestGroup = requestGroupsMap.get(newRequestGroupName);

    setChangeMade(true);
    updateRequestGroupError(newRequestGroup);
    setRequestGroup(newRequestGroup ? newRequestGroup : null);

    if (
      newRequestGroup &&
      // check that new request group is not the same as the previously selected request group
      (!requestGroup || newRequestGroupName !== requestGroup.name) &&
      newRequestGroup.requestTypes
    ) {
      // If a new request group is chosen, change the request types map
      updateRequestTypesMap(newRequestGroup.requestTypes);
      setRequestType(null);
    }

    if (!newRequestGroup) {
      setRequestTypesMap(null);
      setRequestType(null);
    }
  };

  const onRequestGroupInputChange = (newRequestGroupInput: string) => {
    setChangeMade(true);
    setRequestGroupInputGroup(newRequestGroupInput);
    if (!newRequestGroupInput) {
      onRequestGroupChange("");
    }
  };

  /* Functions for Request's RequestType */

  const updateRequestTypeError = (
    requestType: RequestType | null | undefined
  ): string => {
    let error = "";

    // Error if requestTypesMap is loaded and no requestType is chosen
    if (!requestType && requestTypesMap) {
      error = "Please select a type";
    }

    setRequestTypeError(error);
    return error;
  };

  const onRequestTypeChange = (newRequestTypeName: string) => {
    if (!requestTypesMap) return;
    const newRequestType = requestTypesMap.get(newRequestTypeName);

    setChangeMade(true);
    setRequestType(newRequestType ? newRequestType : null);
    updateRequestTypeError(newRequestType);
    return true;
  };

  const onRequestTypeInputChange = (newRequestTypeInput: string) => {
    setChangeMade(true);
    setRequestTypeInputGroup(newRequestTypeInput);
    if (!newRequestTypeInput) {
      onRequestTypeChange("");
    }
  };

  /* Functions for Request's Quantity */
  const updateQuantityError = (newQuantity: number) => {
    let error = "";
    if (!newQuantity) {
      error = "Please enter a number greater or equal to 1";
    }

    setQuantityError(error);
    return error;
  };

  const onQuantityChange = (newQuantity: number) => {
    setChangeMade(true);
    updateQuantityError(newQuantity);
    setQuantity(newQuantity);
  };

  /* Functions for Request's Client */
  const updateClientNameError = (clientName: string) => {
    let error = "";
    if (clientName === "") {
      error = "Please enter a first name";
    }

    setClientNameError(error);
    return error;
  };

  const onClientNameChange = (newClientName: string) => {
    setChangeMade(true);
    updateClientNameError(newClientName);
    setClientName(newClientName);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempRequestGroupError = updateRequestGroupError(requestGroup);
    const tempRequestTypeError = updateRequestTypeError(requestType);
    const tempQuantityNameError = updateQuantityError(quantity);
    const tempClientNameError = updateClientNameError(clientName);

    if (
      !tempRequestGroupError &&
      !tempRequestTypeError &&
      !tempQuantityNameError &&
      !tempClientNameError
    ) {
      if (props.operation === "create") {
        if (requestType) {
          createRequest({
            variables: {
              requestType: requestType._id,
              quantity,
              clientName,
            },
          });
        }
      } else {
        // Edit request
        if (initialRequest && initialRequest.client && requestType) {
          updateRequest({
            variables: {
              id: initialRequest._id,
              requestType: requestType._id,
              quantity,
              clientName,
            },
          });
        }
      }
      props.handleClose();
    }
  };

  const handleClose = () => {
    if (changeMade) {
      setShowAlertDialog(true);
    } else {
      props.handleClose();
    }
  };

  const formTitle =
    props.operation === "create" ? "Create Request" : "Edit Request";
  const formButtonText =
    props.operation === "create" ? "Create request" : "Edit request";

  return (
    <div className="request-form">
      <FormModal
        class="request-form-modal"
        show={true}
        handleClose={handleClose}
        title={formTitle}
        size="medium"
      >
        {loading ? (
          <div className="request-form-modal-loading-content">
            <div className="spinner">
              <Spinner animation="border" role="status" />
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="request-form-modal-content">
            {showAlertDialog && (
              <AlertDialog
                dialogText="This request has not been created yet."
                onExit={props.handleClose}
                onStay={() => {
                  setShowAlertDialog(false);
                }}
              />
            )}
            <div className="searchable-dropdown-form-item">
              <FormItem
                formItemName="Group"
                errorString={requestGroupError}
                isDisabled={false}
                tooltipText="Groups describe the overall category of an item, such as stroller, crib, or bed."
                inputComponent={
                  <SearchableDropdown
                    initialText={
                      requestGroup && requestGroup.name ? requestGroup.name : ""
                    }
                    placeholderText="Select a group"
                    searchPlaceholderText="Search for a group"
                    dropdownItems={
                      requestGroupsMap ? [...requestGroupsMap.keys()] : []
                    } // Pass the name of all request groups
                    isErroneous={
                      requestGroupError !== "" && requestGroupInput === ""
                    }
                    isDisabled={false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onRequestGroupInputChange(e.target.value);
                    }}
                    onSelect={onRequestGroupChange}
                    noItemsAction={
                      <div className="no-items-found">
                        <span className="not-exist-msg">
                          This group does not exist
                        </span>
                        {/* <span className="create-group">
                          <a>
                            <span>Create a new group</span>
                            <i className="bi bi-arrow-right-short"></i>
                          </a>
                        </span> */}
                      </div>
                    }
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
                    initialText={
                      requestType && requestType.name ? requestType.name : ""
                    }
                    placeholderText={
                      requestGroup === null
                        ? "Select a group first"
                        : "Search or create a type"
                    }
                    searchPlaceholderText="Search for a type"
                    dropdownItems={
                      requestTypesMap ? [...requestTypesMap.keys()] : []
                    } // Pass the name of all request groups
                    isErroneous={
                      requestTypeError !== "" && requestTypeInput === ""
                    }
                    isDisabled={requestGroup === null}
                    isEmpty={requestType === null}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onRequestTypeInputChange(e.target.value);
                    }}
                    onSelect={onRequestTypeChange}
                    noItemsAction={
                      <div className="no-items-found">
                        <span className="not-exist-msg">
                          This type does not exist
                        </span>
                      </div>
                    }
                  />
                }
              />
            </div>
            <div className="infinite-dropdown-form-item">
              <FormItem
                formItemName="Item Quantity"
                errorString={quantityError}
                isDisabled={false}
                inputComponent={
                  <TextField
                    input={quantity.toString()}
                    isDisabled={false}
                    isErroneous={quantityError !== ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      onQuantityChange(parseInt(e.target.value));
                    }}
                    name="quantity"
                    placeholder=""
                    type="number"
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onClientNameChange(e.target.value)
                    }
                    name="client-name"
                    placeholder="ex. Julia Michaels"
                    type="text"
                  />
                }
              />
            </div>
            <div className="request-form-modal-footer">
              <Button text={formButtonText} copyText="" />
            </div>
          </form>
        )}
      </FormModal>
    </div>
  );
};

export default RequestGroupForm;
