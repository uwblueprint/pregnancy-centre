import { bindActionCreators, Dispatch } from "redux"
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';

import AlertDialog from '../atoms/AlertDialog'
import { Button } from '../atoms/Button'
import Client from '../../data/types/client'
import FormItem from '../molecules/FormItem'
import FormModal from './FormModal'
import ImagePicker from '../atoms/ImagePicker'
import Request from '../../data/types/request'
import RequestGroup from '../../data/types/requestGroup'
import RequestType from '../../data/types/requestType'
import RichTextField from '../atoms/RichTextField'
import { RootState } from '../../data/reducers'
import { TagInput } from '../atoms/TagInput'
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
  const [requestGroups, setRequestGroups] = usState<Array<RequestGroup> | null>(null)
  const [requestGroup, setRequestGroup] = useState<RequestGroup | null>(null)
  const [requestType, setRequestType] = useState<RequestType | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [client, setClient] = useState<Client | null>(null)
  const [requestGroupError, setRequestGroupError] = useState("")
  const [requestTypeError, setRequestTypeError] = useState("")
  const [quantityError, setQuantityError] = useState("")
  const [clientError, setClientError] = useState("")
  const [loadingRequest, setLoadingRequest] = useState(props.operation === "edit")

  const createRequestMutation = gql`
  mutation CreateRequest(
    $requestType: ID!
    $quantity: Int!
    $clientName: String!
  ) {
    createRequestGroup(requestGroup: {
      name: $name
      description: $description
      image: $image
      requestTypeNames: $requestTypeNames
      clientName: $clientName
    }) {
      success
      message
      id
    }
  }`

  const updateRequestMutation = gql`
  mutation UpdateRequest(
    requestType: $requestType
    quantity: $quantity
    clientName: $clientName
  ) {
    updateRequestGroup(request: {
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

  const getRequestTypesInRequestGroup = gql`
  query FetchRequestGroup($id: ID!) {
    requestGroup(id: $id) {
      requestTypes {
        _id
        name
        deleted
      }
    }
  }
  `

  const [createRequest] = useMutation(createRequestMutation);
  const [updateRequest] = useMutation(updateRequestMutation);


  const fetchRequestGroups = gql`
  query FetchRequestGroups {
    requestGroups {
      _id
      name
    }
  }`

  const { loading } = useQuery(fetchRequestGroups, {
    variables: { id: props.requestId, },
    fetchPolicy: 'network-only',
    onCompleted: (data: { rawRequest: Request }) => {
      const request: Request = JSON.parse(JSON.stringify(data.rawRequest)); // deep-copy since data object is frozen

      setInitialRequest(request)
      setRequestGroup(request.requestType.requestGroup)
      setRequestType(request.requestType)
      setQuantity(request.quantity)
      setClient(request.client)
    }
  });

  useEffect(() => {
    if (!loading) {
      setLoadingRequest(false)
    }
  }, [loading, initialRequest])

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
          requestTypes{
            _id
            name
          }
        }
      }
      client {
        _id
        name
      }
    }
  }`

  if (props.operation === "edit") {
    const { loading } = useQuery(fetchRequest, {
      variables: { id: props.requestId, },
      fetchPolicy: 'network-only',
      onCompleted: (data: { rawRequest: Request }) => {
        const request: Request = JSON.parse(JSON.stringify(data.rawRequest)); // deep-copy since data object is frozen

        setInitialRequest(request)
        setRequestGroup(request.requestType.requestGroup)
        setRequestType(request.requestType)
        setQuantity(request.quantity)
        setClient(request.client)
      }
    });

    useEffect(() => {
      if (!loading) {
        setLoadingRequest(false)
      }
    }, [loading])
  }

  /* Functions for Request's RequestGroup */
  const updateRequestGroupError = (requestGroup: RequestGroup): string => {
    let error = ""
    if (!requestGroup) {
      error = "Please select a group";
    }

    setRequestGroupError(error)
    return error;
  }

  const onRequestGroupChange = (newRequestGroup) => {
    setChangeMade(true);
    setRequestGroup(newRequestGroup);
    updateRequestGroupError(newRequestGroup)
  }

  /* Functions for Request's RequestType */

  const updateInputRequestTypeNameError = (inputRequestTypeName: string): string => {
    let error = ""
    if (requestTypeNames.find(requestTypeName => requestTypeName === inputRequestTypeName)) {
      error = "There is already a type with this name";
    }
    else if (inputRequestTypeName.length > 40) {
      error = "Type name cannot exceed 40 characters";
    }

    setRequestTypesError(error);
    return error;
  }

  const updateRequestTypeNamesError = (requestTypes: Array<string>): string => {
    let error = ""
    if (requestTypes.length === 0) {
      error = "Please create at least 1 type";
    }

    setRequestTypesError(error);
    return error;
  }

  const onAddRequestType = (newRequestTypeName: string) => {
    const error = updateInputRequestTypeNameError(newRequestTypeName);

    if (error === "") {
      setRequestTypeNames(requestTypeNames.concat([newRequestTypeName]));
    }
    setChangeMade(true);
  }

  const onDeleteRequestType = (targetRequestTypeName: string) => {
    const newRequestTypeNames = requestTypeNames.filter((requestTypeName) => requestTypeName !== targetRequestTypeName);

    setChangeMade(true);
    setRequestTypeNames(newRequestTypeNames);
    updateRequestTypeNamesError(newRequestTypeNames)
  }

  const onInputRequestTypeNameChange = (requestTypeName: string) => {
    setChangeMade(true);
    updateInputRequestTypeNameError(requestTypeName)
    return true;
  }

  /* Functions for Request's Quantity */
  const updateDescriptionError = (description: string) => {
    let error = ""
    if (!description) {
      error = "Please enter a description";
    }

    setDescriptionError(error)
    return error;
  }

  const onDescriptionChange = (newDescription: string) => {
    setChangeMade(true);
    setDescription(newDescription)
    updateDescriptionError(description)
  }

  const onDecriptionEmpty = () => {
    onDescriptionChange("")
  }

  /* Functions for Request's Client */
  const updateImageError = (image: string) => {
    let error = ""
    if (image === "") {
      error = "Please select an image";
    }

    setImageError(error)
    return error;
  }

  const onImageChange = (newImage: string) => {
    setChangeMade(true);
    updateImageError(newImage)
    if (images.find((imageUrl) => imageUrl === newImage)) {
      setImage(newImage)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempNameError = updateNameError(name);
    const tempDescriptionError = updateDescriptionError(description);
    const tempImageError = updateImageError(image);
    const tempRequestTypesError = updateRequestTypeNamesError(requestTypeNames);

    if (!tempNameError && !tempDescriptionError && !tempImageError && !tempRequestTypesError) {
      if (props.operation === "create") {

        createRequestGroup({ variables: { name, description, image, requestTypeNames } })
          .catch((err) => { console.log(err) })
      }
      else {

        updateRequestGroup({ variables: { id: props.requestGroupId, name, description, image, requestTypeNames } })
          .catch((err) => { console.log(err) })
      }

      props.handleClose()
    }
  }

  const handleClose = () => {
    if (changeMade) {
      setShowAlertDialog(true);
    }
    else {
      props.handleClose();
    }
  }


  const formTitle = props.operation === "create" ? "Create Request Group" : "Edit Request Group";
  const formButtonText = props.operation === "create" ? "Create request group" : "Edit request group";

  return <div className="request-group-form">
    <FormModal
      class="request-group-form-modal"
      show={true}
      handleClose={handleClose}
      title={formTitle}
      size="large">
      {showAlertDialog &&
        <AlertDialog
          dialogText="You have unsaved changes to this group."
          onExit={props.handleClose}
          onStay={() => { setShowAlertDialog(false) }} />
      }
      {loadingRequestGroup
        ? <div className="request-group-form-modal-loading-content">
          <div className="spinner">
            <Spinner animation="border" role="status" />
          </div>
        </div>
        : <form onSubmit={onSubmit}>
          <div className="request-group-form-modal-content">
            <div className="request-group-form-modal-panel" id="left">
              <div className="text-field-form-item">
                <FormItem
                  formItemName="Group Name"
                  errorString={nameError}
                  isDisabled={false}
                  tooltipText="Groups describe the overall category of an item, such as stroller, crib, or bed."
                  inputComponent={<TextField
                    name="name"
                    placeholder="Enter a group name"
                    type="text"
                    input={name}
                    isDisabled={false}
                    isErroneous={nameError !== ""}
                    onChange={onNameChange}
                  />
                  }
                />
              </div>
              <div className="tag-input-form-item">
                <FormItem
                  formItemName="Item Types"
                  instructions="If no types are applicable, create a universal type such as “One Size”"
                  errorString={requestTypesError}
                  isDisabled={false}
                  tooltipText="Types describe more specific information about a request, such as size, capacity, or intended child age."
                  inputComponent={
                    <TagInput
                      tagStrings={requestTypeNames}
                      placeholder="Enter a new type"
                      actionString="Add new type:"
                      isErroneous={requestTypesError !== ""}
                      onChange={onInputRequestTypeNameChange}
                      onSubmit={onAddRequestType}
                      onDelete={onDeleteRequestType}
                    />
                  }
                />
              </div>
              <div className="richtext-field-form-item">
                <FormItem
                  formItemName="Description & Requirements"
                  instructions="Formatting Tip: Ctrl-B to bold, “-” + Space to create a bullet point"
                  errorString={descriptionError}
                  isDisabled={false}
                  inputComponent={
                    <RichTextField
                      initialContent={initialRequestGroup && initialRequestGroup.description ? initialRequestGroup.description : ""}
                      defaultText="Enter group description here"
                      onChange={onDescriptionChange}
                      onEmpty={onDecriptionEmpty}
                      isErroneous={descriptionError !== ""}
                    />
                  }
                />
              </div>
            </div>
            <div className="request-group-form-modal-panel" id="right">
              <div className="imagepicker-form-item">
                <FormItem
                  formItemName="Image"
                  errorString={imageError}
                  isDisabled={false}
                  inputComponent={
                    <ImagePicker
                      onImageChange={onImageChange}
                      images={images}
                      selected={image}
                      isErroneous={imageError !== ""}
                    />
                  }
                />
              </div>
            </div>
          </div>
          <div className="request-group-form-modal-footer">
            <Button
              text={formButtonText}
              copyText=""
            />
          </div>
        </form>}
    </FormModal>
  </div >
};

const mapStateToProps = (store: RootState): StateProps => {
  return {
    requestGroups: store.requestGroups.data,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return bindActionCreators(
    {
      upsertRequestGroup
    },
    dispatch
  );
};

export default RequestGroupForm;
