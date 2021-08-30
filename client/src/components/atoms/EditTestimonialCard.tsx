import { Col, Row } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import { Button } from "../atoms/Button";
import DefaultImage from "../../assets/grey-background.png"
import OverlayImage from "../../assets/image-upload.png"
import TextArea from "../atoms/TextArea";
import UploadImageModal from "../organisms/UploadImageModal"

interface Props {
    id: number;
    imagePath: string;
    testimonial: string;
    showDelete: boolean;
    onDelete: (id: number) => void;
    onSave: (id: number, imagePath: string, testimonial: string) => void;
    onCancel: (id: number) => void;
}

const EditTestimonialCard: FunctionComponent<Props> = (props: Props) => {
    const [testimonial, setTestimonial] = useState(props.testimonial);
    const [imagePath, setImagePath] = props.imagePath === "" ? useState(DefaultImage) : useState(props.imagePath);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const minNumChars = 80;
    const [testimonialError, setTestimonialError] = useState(testimonial.length > minNumChars);
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTestimonial(event.target.value);
        if (event.target.value.length < minNumChars) {
            setTestimonialError(true);
        } else {
            setTestimonialError(false);
        }
    }
    const textAreaProps = {
        isErroneous: false,
        onChange: onChange,
        value: testimonial,
        placeholder: "",
        label: "Edit Client Story",
        maxNumChars: 400,
        minNumChars: minNumChars
    }

    const primaryBtnProps = {
        className: "update-button",
        text: "Update",
        onClick: () => props.onSave(props.id, imagePath, testimonial),
        copyText: "",
        disabled: testimonialError
    }

    const secondaryBtnProps = {
        className: "cancel-button",
        text: "Cancel",
        onClick: () => props.onCancel(props.id),
        copyText: ""
    }

    const uploadImageProps = {
        handleClose: () => setShowImagePicker(false),
        onSubmit: (imagePath: string) => {
            setImagePath(imagePath);
        }
    }

    return (
        <div className="edit-testimonial-card">
            {showImagePicker && (
                <UploadImageModal {...uploadImageProps} />
            )}
            <div className="image-upload" onClick={() => setShowImagePicker(true)}>
                <img className="base" src={imagePath}/>
                <div className="overlay">
                    <img className="overlay-image" src={OverlayImage}/>
                    <p className="overlay-text">Add Photo</p>
                </div>
            </div>
            <div className="text-and-submission">
                <TextArea {...textAreaProps} />
                {testimonialError && (
                    <p className="error-text"> Please enter at least {minNumChars} characters.</p>
                )}
                <div className="buttons" >
                    <Button {...primaryBtnProps} />
                    <Button {...secondaryBtnProps} />
                    <i className="bi bi-trash" onClick={() => props.onDelete(props.id)} />
                </div>
            </div>
        </div>
    );
};

export default EditTestimonialCard;
