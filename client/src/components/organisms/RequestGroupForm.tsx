import { bindActionCreators, Dispatch } from "redux"
import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import AlertDialog from '../atoms/AlertDialog'
import { Button } from '../atoms/Button'
import FormItem from '../molecules/FormItem'
import FormModal from './FormModal'
import ImagePicker from '../atoms/ImagePicker'
import RequestGroup from '../../data/types/requestGroup'
import RichTextField from '../atoms/RichTextField'
import { RootState } from '../../data/reducers'
import { TagInput } from '../atoms/TagInput'
import { TextField } from '../atoms/TextField'
import { upsertRequestGroup } from '../../data/actions'

interface StateProps {
  requestGroups: Array<RequestGroup>
}

interface DispatchProps {
  upsertRequestGroup: typeof upsertRequestGroup
}


type Props = StateProps
  & DispatchProps
  & {
    handleClose: () => void,
    requestGroupId?: string,
    operation: "create" | "edit"
  };

const RequestGroupForm: FunctionComponent<Props> = (props: Props) => {
  const [initialRequestGroup, setInitialRequestGroup] = useState<RequestGroup | null>(null)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [changeMade, setChangeMade] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [requestTypeNames, setRequestTypeNames] = useState<Array<string>>([])
  const [nameError, setNameError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const [imageError, setImageError] = useState("")
  const [requestTypesError, setRequestTypesError] = useState("")

  const images = ["https://source.unsplash.com/RcgiSN482VI",
    "https://source.unsplash.com/7ydep8OEvbc",
    "https://source.unsplash.com/0hiUWSi7jvs",
    "https://source.unsplash.com/uWVWQ8gF8PE",
    "https://source.unsplash.com/ZQ_0jk66-1E",
    "https://source.unsplash.com/7EWCIzU4TIg",
    "https://source.unsplash.com/FOrNjVWdUzM",
  ]


  const requestGroupQuery = gql`
  query FetchRequestGroup($id: ID!) {
    requestGroup(id: $id) {
      id
      name
      description
      image
      requestTypes {
        id
        name
        deleted
      }
    }
  }`

  if (props.requestGroupId) {
    useQuery(requestGroupQuery, {
      variables: { id: props.requestGroupId, },
      onCompleted: (data: { requestGroup: RequestGroup }) => {
        const res: RequestGroup = JSON.parse(JSON.stringify(data.requestGroup)); // deep-copy since data object is frozen

        setInitialRequestGroup(res)
        setName(res.name ? res.name : "")
        setDescription(res.description ? res.description : "")
        setImage(res.image ? res.image : "")

        setRequestTypeNames(
          res.requestTypes ?
            res.requestTypes
              .filter((requestType) => requestType.name)
              .map((requestType) => requestType.name as string)
            : []
        )
      }
    });
  }

  /* Functions for RequestGroup's Name*/
  const getNameError = (name: string): string => {
    if (name.length === 0) {
      return "Please enter a group name";
    }
    if (name.length > 20) {
      return "Group name cannot exceed 20 characters";
    }
    if (props.requestGroups.find((requestGroup) => requestGroup.name === name && requestGroup._id !== props.requestGroupId)) {
      return "There is already a group with this name";
    }

    return "";
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newName: string = event.target.value;

    setChangeMade(true);
    setName(newName);
    setNameError(getNameError(newName))
  }

  /* Functions for RequestGroup's RequestTypes */

  const getInputRequestTypeNameError = (inputRequestTypeName: string): string => {
    if (requestTypeNames.find(requestTypeName => requestTypeName === inputRequestTypeName)) {
      return "There is already a type with this name";
    }
    else if (inputRequestTypeName.length > 40) {
      return "Type name cannot exceed 40 characters";
    }
    return "";
  }

  const onAddRequestType = (newRequestTypeName: string) => {
    const error = getInputRequestTypeNameError(newRequestTypeName);

    if (error === "") {
      setRequestTypeNames(requestTypeNames.concat([newRequestTypeName]));
    }
    setChangeMade(true);
    setRequestTypesError(error);
  }

  const onDeleteRequestType = (targetRequestTypeName: string) => {
    const newRequestTypeNames = requestTypeNames.filter((requestTypeName) => requestTypeName !== targetRequestTypeName);

    setChangeMade(true);
    setRequestTypeNames(newRequestTypeNames);
    setRequestTypesError(getRequestTypeNamesError(newRequestTypeNames))
  }

  const onInputRequestTypeNameChange = (requestTypeName: string) => {
    setChangeMade(true);
    setRequestTypesError(getInputRequestTypeNameError(requestTypeName))
    return true;
  }

  const getRequestTypeNamesError = (requestTypes: Array<string>): string => {
    if (requestTypes.length === 0) {

      return "Please create at least 1 type";
    }
    return "";
  }

  /* Functions for RequestGroup's Description */
  const getDescriptionError = (description: string) => {
    if (!description) {
      return "Please enter a description";
    }

    return "";
  }

  const onDescriptionChange = (newDescription: string) => {
    setChangeMade(true);
    setDescription(newDescription)
    setDescriptionError(getDescriptionError(description))
  }

  const onDecriptionEmpty = () => {
    onDescriptionChange("")
  }

  /* Functions for RequestGroup's Image */
  const getImageError = (image: string) => {
    if (image === "") {
      return "Please select an image";
    }
    return "";
  }

  const onImageChange = (newImage: string) => {
    setChangeMade(true);
    setImageError(getImageError(newImage))
    if (images.find((imageUrl) => imageUrl === newImage)) {
      setImage(newImage)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempNameError = getNameError(name);
    const tempDescriptionError = getDescriptionError(description);
    const tempImageError = getImageError(image);
    const tempRequestTypesError = getRequestTypeNamesError(requestTypeNames);

    if (!tempNameError && !tempDescriptionError && !tempImageError && !tempRequestTypesError) {
      // do mutation
      props.handleClose()
    }
    else {
      setNameError(tempNameError);
      setDescriptionError(tempDescriptionError);
      setImageError(tempImageError);

      setRequestTypesError(tempRequestTypesError);
    }
  }

  const handleClose = () => {
    // id: ID
    // name: String
    // description: String
    // image: String
    // requestTypes: [ID]
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
      <form onSubmit={onSubmit}>
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
      </form>
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

export default connect<StateProps, DispatchProps, Record<string, unknown>, RootState>(mapStateToProps, mapDispatchToProps)(RequestGroupForm);