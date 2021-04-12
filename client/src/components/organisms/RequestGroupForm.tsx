import { bindActionCreators, Dispatch } from "redux"
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";

import AlertDialog from '../atoms/AlertDialog'
import CommonModal from './Modal'
import FormItem from '../molecules/FormItem'
import RequestGroup from '../../data/types/requestGroup'
import { RootState } from '../../data/reducers'
import { TagInput } from '../atoms/TagInput'
import { TextField } from '../atoms/TextField'
import { upsertRequestGroup } from '../../data/actions'
// import Tooltip from '../atoms/Tooltip'

interface StateProps {
  requestGroups: Array<RequestGroup>
}

interface DispatchProps {
  upsertRequestGroup: typeof upsertRequestGroup
}


type Props = StateProps
  & DispatchProps
  & {
    show: boolean,
    handleClose: () => void,
    requestGroupId?: string,
    operation: "create" | "edit"
  };

const RequestGroupForm: FunctionComponent<Props> = (props: Props) => {
  // const [initialRequestGroup, setInitialRequestGroup] = useState<RequestGroup | null>(null)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [changeMade, setChangeMade] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [requestTypesToIdMap, setRequestTypesToIdMap] = useState(new Map<string, string>())
  const [requestTypeNames, setRequestTypeNames] = useState<Array<string>>([])
  // const [inputRequestTypeName, setInputRequestTypeName] = useState("")
  const [nameError, setNameError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const [imageError, setImageError] = useState("")
  const [requestTypesError, setRequestTypesError] = useState("")


  const requestGroupQuery = gql`
  {
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
    }
  }`

  // id: ID
  // name: String
  // description: String
  // image: String
  // requestTypes: [ID]

  if (props.requestGroupId) {
    const { loading, error } = useQuery(requestGroupQuery, {
      variables: { id: props.requestGroupId, },
      onCompleted: (data: { requestGroup: RequestGroup }) => {
        const res: RequestGroup = JSON.parse(JSON.stringify(data.requestGroup)); // deep-copy since data object is frozen

        setName(res.name ? res.name : "")
        setDescription(res.description ? res.description : "")
        setImage(res.image ? res.image : "")

        res.requestTypes?.forEach((requestType) => {
          if (requestType.name && requestType._id) {
            setRequestTypesToIdMap(requestTypesToIdMap.set(requestType.name, requestType._id))
          }
        })

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

  const getInputRequestTypeNameError = (requestTypeName: string): string => {
    if (requestTypeNames.find(requestTypeName => requestTypeName === requestTypeName)) {
      return "There is already a type with this name";
    }
    else if (requestTypeName.length > 40) {
      return "Type name cannot exceed 40 characters";
    }
    return "";
  }

  const getRequestTypeNamesError = (requestTypes: Array<string>): string => {
    if (requestTypes.length === 0) {
      return "Please create at least 1 type";
    }
    return "";
  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName: string = event.target.value;

    setChangeMade(true);
    setName(newName);
    setNameError(getNameError(newName))
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
    // setInputRequestTypeName(requestTypeName);
    setRequestTypesError(getInputRequestTypeNameError(requestTypeName))
    return true;
  }

  const onSubmit = () => {

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
  return <div className="request-group-form">
    {showAlertDialog &&
      <AlertDialog
        dialogText="You have unsaved changes to this group."
        onExit={() => props.handleClose()}
        onStay={() => { setShowAlertDialog(false) }} />
    }
    <CommonModal
      class="request-group-form-modal"
      show={true}
      handleClose={handleClose}
      header={<h1>{formTitle}</h1>}
      size="large">
      <form>
        <div className="request-group-form-modal-content">
          <div className="request-group-form-modal-panel" id="left">
            <FormItem
              formItemName="Group Name"
              errorString={nameError}
              isDisabled={false}
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
          <FormItem
            formItemName="Item Types"
            errorString={requestTypesError}
            isDisabled={false}
            inputComponent={<TagInput
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
          <FormItem
            formItemName="Description & Requirements"
            errorString={nameError}
            isDisabled={false}
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
        <div className="request-group-form-modal-panel" id="right">

        </div>
        </div>
      </form>
    </CommonModal>
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