import { gql, useMutation, useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Area } from "react-easy-crop/types";

import FormItem from "../molecules/FormItem";
import FormModal from "./FormModal";
import { getCroppedImg } from "../utils/imageCrop";
import { getFilesFromFolder } from "../../services/storage";
import ImagePicker from "../atoms/ImagePicker";
import RequestGroup from "../../data/types/requestGroup";
import RichTextField from "../atoms/RichTextField";
import { TagInput } from "../atoms/TagInput";
import { TextField } from "../atoms/TextField";
import UploadThumbnailService from "../../services/upload-thumbnail";

type Props = {
    handleClose: () => void;
    onSubmitComplete: () => void;
    requestGroupId?: string;
    operation: "create" | "edit";
};

type RequestTypeData = { id: string | null; deleted: boolean };

const RequestGroupForm: FunctionComponent<Props> = (props: Props) => {
    const imageFolder = "request_images";
    const [initialRequestGroup, setInitialRequestGroup] = useState<RequestGroup | null>(null);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [changeMade, setChangeMade] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [uploadedImg, setUploadedImg] = useState("");
    const [images, setImages] = useState([""]);
    const [requestTypesMap, setRequestTypesMap] = useState<Map<string, RequestTypeData>>(new Map());
    const [nameError, setNameError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [imageError, setImageError] = useState("");
    const [requestTypesError, setRequestTypesError] = useState("");
    const [loadingRequestGroup, setLoadingRequestGroup] = useState(props.operation === "edit");
    const [croppedArea, setCroppedArea] = useState<Area>({ width: 0, height: 0, x: 0, y: 0 });
    const [requestGroupsMap, setRequestGroupsMap] = useState<Map<string, RequestGroup>>(new Map());

    useEffect(() => {
        async function getImages() {
            setImages(await getFilesFromFolder(imageFolder));
        }
        getImages();
    }, []);

    const createRequestTypeMutation = gql`
        mutation CreateRequestType($name: String!, $requestGroupId: ID!) {
            createRequestType(requestType: { name: $name, requestGroup: $requestGroupId }) {
                _id
                name
            }
        }
    `;

    const deleteRequestTypeMutation = gql`
        mutation DeleteRequestType($id: ID!) {
            deleteRequestType(_id: $id) {
                _id
            }
        }
    `;

    const createRequestGroupMutation = gql`
        mutation CreateRequestGroup($name: String!, $description: String!, $image: String!) {
            createRequestGroup(requestGroup: { name: $name, description: $description, image: $image }) {
                _id
            }
        }
    `;

    const updateRequestGroupMutation = gql`
        mutation UpdateRequestGroup($id: ID!, $name: String!, $description: String!, $image: String!) {
            updateRequestGroup(requestGroup: { _id: $id, name: $name, description: $description, image: $image }) {
                _id
            }
        }
    `;

    const [createRequestType] = useMutation(createRequestTypeMutation, {
        onError: (error) => {
            console.log(error);
        }
    });
    const [deleteRequestType] = useMutation(deleteRequestTypeMutation, {
        onError: (error) => {
            console.log(error);
        }
    });
    const [createRequestGroup] = useMutation(createRequestGroupMutation, {
        onError: (error) => {
            console.log(error);
        }
    });
    const [updateRequestGroup] = useMutation(updateRequestGroupMutation, {
        onError: (error) => {
            console.log(error);
        }
    });

    const requestGroupQuery = gql`
        query FetchRequestGroup($id: ID!) {
            requestGroup(_id: $id) {
                _id
                name
                description
                image
                requestTypes {
                    _id
                    name
                    deletedAt
                }
            }
        }
    `;

    const fetchRequestGroupsQuery = gql`
        query FetchRequestGroups {
            requestGroups {
                _id
                name
                deletedAt
            }
        }
    `;

    useQuery(fetchRequestGroupsQuery, {
        fetchPolicy: "network-only",
        onCompleted: (data: { requestGroups: Array<RequestGroup> }) => {
            const requestGroups: Array<RequestGroup> = JSON.parse(JSON.stringify(data.requestGroups)); // deep-copy since data object is frozen

            const map = new Map(
                requestGroups
                    .filter((requestGroup) => requestGroup.deletedAt == null)
                    .reduce((entries, requestGroup) => {
                        if (requestGroup && requestGroup.name) {
                            entries.push([requestGroup.name, requestGroup]);
                        }
                        return entries;
                    }, [] as Array<[string, RequestGroup]>)
            );
            setRequestGroupsMap(map);
        }
    });

    if (props.operation === "edit") {
        const { loading } = useQuery(requestGroupQuery, {
            variables: { id: props.requestGroupId },
            fetchPolicy: "network-only",
            onCompleted: (data: { requestGroup: RequestGroup }) => {
                const retrievedRequestGroup: RequestGroup = JSON.parse(JSON.stringify(data.requestGroup)); // deep-copy since data object is frozen

                setInitialRequestGroup(retrievedRequestGroup);
                setName(retrievedRequestGroup.name ? retrievedRequestGroup.name : "");
                setDescription(retrievedRequestGroup.description ? retrievedRequestGroup.description : "");
                setImage(retrievedRequestGroup.image ? retrievedRequestGroup.image : "");
                setRequestTypesMap(
                    retrievedRequestGroup.requestTypes
                        ? retrievedRequestGroup.requestTypes
                              .filter((requestType) => requestType.name && requestType.deletedAt == null)
                              .reduce((map, requestType) => {
                                  map.set(requestType.name, {
                                      id: requestType._id,
                                      deleted: false
                                  });
                                  return map;
                              }, new Map())
                        : new Map()
                );
            }
        });

        useEffect(() => {
            if (!loading) {
                setLoadingRequestGroup(false);
            }
        }, [loading]);
    }

    /* Functions for RequestGroup's Name*/
    const updateNameError = (name: string): string => {
        let error = "";
        if (name.length === 0) {
            error = "Please enter a need name";
        }
        if (name.length > 20) {
            error = "Need name cannot exceed 20 characters";
        }
        const existingNameRequestGroup = requestGroupsMap.get(name);
        if (existingNameRequestGroup && existingNameRequestGroup._id !== props.requestGroupId) {
            error = "There is already a need with this name";
        }

        setNameError(error);
        return error;
    };

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const newName: string = event.target.value;

        setChangeMade(true);
        setName(newName);
        updateNameError(newName);
    };

    /* Functions for RequestGroup's RequestTypes */

    const updateInputRequestTypeNameError = (inputRequestTypeName: string): string => {
        let error = "";
        const requestTypeData = requestTypesMap.get(inputRequestTypeName);
        if (requestTypeData != null && requestTypeData.deleted === false) {
            error = "There is already a type with this name";
        } else if (inputRequestTypeName.length > 40) {
            error = "Type name cannot exceed 40 characters";
        }

        setRequestTypesError(error);
        return error;
    };

    const onAddRequestType = (newRequestTypeName: string) => {
        const error = updateInputRequestTypeNameError(newRequestTypeName);
        if (error === "") {
            const newRequestTypeData: RequestTypeData = requestTypesMap.get(newRequestTypeName) ?? {
                id: null,
                deleted: false
            };
            newRequestTypeData.deleted = false;
            setRequestTypesMap(new Map(requestTypesMap).set(newRequestTypeName, newRequestTypeData));
        }
        setChangeMade(true);
    };

    const onDeleteRequestType = (targetRequestTypeName: string) => {
        const requestTypeValue = requestTypesMap.get(targetRequestTypeName);
        if (requestTypeValue != null) {
            setChangeMade(true);
            setRequestTypesMap(
                new Map(requestTypesMap).set(targetRequestTypeName, { ...requestTypeValue, deleted: true })
            );
        }
    };

    const onInputRequestTypeNameChange = (requestTypeName: string) => {
        setChangeMade(true);
        updateInputRequestTypeNameError(requestTypeName);
        return true;
    };

    /* Functions for RequestGroup's Description */
    const updateDescriptionError = (description: string) => {
        let error = "";
        if (!description) {
            error = "Please enter a description";
        }

        setDescriptionError(error);
        return error;
    };

    const onDescriptionChange = (newDescription: string) => {
        setChangeMade(true);
        setDescription(newDescription);
        updateDescriptionError(newDescription);
    };

    const onDecriptionEmpty = () => {
        onDescriptionChange("");
    };

    /* Functions for RequestGroup's Image */
    const updateImageError = (image: string) => {
        let error = "";
        if (image === "") {
            error = "Please select an image";
        }

        setImageError(error);
        return error;
    };

    const onUploadImg = (uploadedImg: string) => {
        setChangeMade(true);
        updateImageError(uploadedImg);
        setUploadedImg(uploadedImg);
    };

    const onImageChange = (newImage: string) => {
        setChangeMade(true);
        updateImageError(newImage);
        if (newImage.length === 0 || images.find((imageUrl) => imageUrl === newImage)) {
            setImage(newImage);
            setUploadedImg("");
        }
    };
    const onCroppedAreaChange = (area: Area) => {
        setCroppedArea(area);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const tempNameError = updateNameError(name);
        const tempDescriptionError = updateDescriptionError(description);
        const tempImageError = imageError;

        if (!tempNameError && !tempDescriptionError && !tempImageError) {
            let selectedImg = image;
            if (uploadedImg !== "") {
                const croppedImg = await getCroppedImg(uploadedImg, croppedArea);

                const croppedImgURL = await UploadThumbnailService.upload(
                    croppedImg,
                    new Date().toISOString(),
                    "thumbnail_images"
                );
                selectedImg = croppedImgURL;
            }

            if (props.operation === "create") {
                let requestGroupId: string | null = null;
                let newRequestTypeNames = Array.from(requestTypesMap)
                    .filter(([_requestTypeName, requestTypeData]) => requestTypeData.deleted === false)
                    .map(([requestTypeName, _requestTypeData]) => requestTypeName);
                if (newRequestTypeNames.length === 0) {
                    newRequestTypeNames = ["One Size"];
                }
                createRequestGroup({ variables: { name, description, image: selectedImg } })
                    .then((response) => {
                        requestGroupId = response.data.createRequestGroup._id;
                        const createRequestTypePromises = newRequestTypeNames.map((requestTypeName) =>
                            createRequestType({ variables: { name: requestTypeName, requestGroupId } })
                        );
                        return Promise.all(createRequestTypePromises);
                    })
                    .then(() => {
                        props.onSubmitComplete();
                    });
            } else {
                const newRequestTypeNames = Array.from(requestTypesMap)
                    .filter(
                        ([_requestTypeName, requestTypeData]) =>
                            requestTypeData.id == null && requestTypeData.deleted === false
                    )
                    .map(([requestTypeName, _requestTypeData]) => requestTypeName);
                const deletedRequestTypeIds = Array.from(requestTypesMap.values())
                    .filter((requestTypeData) => requestTypeData.id != null && requestTypeData.deleted === true)
                    .map((requestTypeData) => requestTypeData.id);

                const createRequestTypePromises = newRequestTypeNames.map((requestTypeName) =>
                    createRequestType({
                        variables: { name: requestTypeName, requestGroupId: initialRequestGroup?._id }
                    })
                );
                const deleteRequestTypePromises = deletedRequestTypeIds.map((requestTypeId) =>
                    deleteRequestType({ variables: { id: requestTypeId } })
                );
                Promise.all(createRequestTypePromises.concat(deleteRequestTypePromises))
                    .then(() => {
                        if (initialRequestGroup?._id) {
                            return updateRequestGroup({
                                variables: { id: initialRequestGroup._id, name, description, image: selectedImg }
                            });
                        }
                    })
                    .then(() => {
                        props.onSubmitComplete();
                    });
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

    const formTitle = props.operation === "create" ? "Create New Need" : "Edit Need";
    const formButtonText = props.operation === "create" ? "Create need" : "Edit need";

    return (
        <FormModal
            className="request-group-form"
            show={true}
            handleClose={handleClose}
            title={formTitle}
            submitButtonText={formButtonText}
            onSubmit={onSubmit}
            onCancel={handleClose}
            alertDialogProps={{
                dialogText: "You have unsaved changes to this need.",
                onStay: () => {
                    setShowAlertDialog(false);
                },
                onExit: props.handleClose
            }}
            showAlertDialog={showAlertDialog}
            loading={loadingRequestGroup}
        >
            <div className="request-group-form-fields">
                <div className="request-group-form-panel" id="left">
                    <div className="text-field-form-item">
                        <FormItem
                            formItemName="Name"
                            errorString={nameError}
                            isDisabled={false}
                            tooltipText="Needs describe the overall category of an item, such as stroller, crib, or bed."
                            showErrorIcon={false}
                            inputComponent={
                                <TextField
                                    name="name"
                                    placeholder="Enter a name for the need (e.g. stroller, crib)"
                                    type="text"
                                    input={name}
                                    isDisabled={false}
                                    isErroneous={nameError !== ""}
                                    onChange={onNameChange}
                                    showRedErrorText={true}
                                />
                            }
                        />
                    </div>
                    <div className="tag-input-form-item">
                        <FormItem
                            formItemName="Types"
                            instructions="If no types are applicable for this item, the “One Size” type will be created automatically."
                            errorString={requestTypesError}
                            isDisabled={false}
                            tooltipText="Types describe more specific information about a request, such as size, capacity, or intended child age."
                            showErrorIcon={false}
                            inputComponent={
                                <TagInput
                                    tagStrings={Array.from(requestTypesMap)
                                        .filter(
                                            ([_requestTypeName, requestTypeData]) => requestTypeData.deleted === false
                                        )
                                        .map(([requestTypeName, _requestTypeData]) => requestTypeName)}
                                    placeholder="Create a type for the need"
                                    actionString="Add new type:"
                                    isErroneous={requestTypesError !== ""}
                                    onChange={onInputRequestTypeNameChange}
                                    onSubmit={onAddRequestType}
                                    onDelete={onDeleteRequestType}
                                    showRedErrorText={true}
                                    isNoTagsAllowed={false}
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
                            showErrorIcon={false}
                            inputComponent={
                                <RichTextField
                                    initialContent={
                                        initialRequestGroup && initialRequestGroup.description
                                            ? initialRequestGroup.description
                                            : ""
                                    }
                                    defaultText="Enter a description of the need and any requirements for the item"
                                    onChange={onDescriptionChange}
                                    onEmpty={onDecriptionEmpty}
                                    isErroneous={descriptionError !== ""}
                                />
                            }
                        />
                    </div>
                </div>
                <div className="request-group-form-panel" id="right">
                    <div className="imagepicker-form-item">
                        <FormItem
                            formItemName="Image"
                            instructions={
                                image === ""
                                    ? "Uploads must be JPEGs or PNGs, at least 600 x 430 pixels, and less than 5MB"
                                    : ""
                            }
                            errorString={imageError}
                            isDisabled={false}
                            showErrorIcon={false}
                            inputComponent={
                                <ImagePicker
                                    onImageChange={onImageChange}
                                    onCroppedAreaChange={onCroppedAreaChange}
                                    images={images}
                                    selected={image}
                                    isErroneous={imageError !== ""}
                                    uploadedImg={uploadedImg}
                                    onUploadImg={onUploadImg}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
        </FormModal>
    );
};

export default RequestGroupForm;
