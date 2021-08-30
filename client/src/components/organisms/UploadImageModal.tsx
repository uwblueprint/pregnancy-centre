
import React, { FunctionComponent, useState } from "react";
import { Area } from "react-easy-crop/types";

import FormItem from "../molecules/FormItem";
import FormModal from "./FormModal";
import { getCroppedImg } from "../utils/imageCrop";
import ImagePicker from "../atoms/ImagePicker";
import UploadThumbnailService from "../../services/upload-thumbnail";

interface Props {
    handleClose: () => void;
    onSubmit: (imageURL: string) => void;
}

const UploadImageModal: FunctionComponent<Props> = (props: Props) => {
    const [image, setImage] = useState("");
    const [croppedArea, setCroppedArea] = useState<Area>({ width: 0, height: 0, x: 0, y: 0 });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const updateError = (image: string) => {
        let error = "";
        if (image === "") {
            error = "Please select an image";
        }
        setError(error);
        return error;
    };

    const onImageChange = (newImage: string) => {
        setImage(newImage);
        updateError(newImage);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tempError = updateError(image);
        if (tempError !== "") {
            return;
        }

        setLoading(true);
        const croppedImg = await getCroppedImg(image, croppedArea);
        const croppedImgURL = await UploadThumbnailService.upload(
            croppedImg,
            new Date().toISOString(),
            "homepage_images"
        );
        props.onSubmit(croppedImgURL);
    };

    return (
        <FormModal
            className="upload-image-modal"
            show={true}
            handleClose={props.handleClose}
            title="Upload Image"
            submitButtonText="Upload"
            onSubmit={onSubmit}
            onCancel={props.handleClose}
            disableSubmitButton={loading}
            disableCancelButton={loading}
        >
            <div className="form-item">
                <FormItem
                    formItemName="Image"
                    instructions={
                        image === ""
                            ? "Uploads must be JPEGs or PNGs, at least 600 x 430 pixels, and less than 5MB"
                            : ""
                    }
                    errorString={error}
                    isDisabled={false}
                    showErrorIcon={false}
                    showLabel={false}
                    showErrorUnderInput={true}
                    inputComponent={
                        <ImagePicker
                            onImageChange={onImageChange}
                            onCroppedAreaChange={setCroppedArea}
                            images={[]}
                            selected=""
                            isErroneous={error !== ""}
                            uploadedImg={image}
                            onUploadImg={onImageChange}
                        />
                    }
                />
            </div>
        </FormModal>
    );
};

export default UploadImageModal;
