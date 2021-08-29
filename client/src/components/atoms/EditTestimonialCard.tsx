import { Col, Row } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
import { Button } from "../atoms/Button";
import DefaultImage from "../../assets/grey-background.png"
import OverlayImage from "../../assets/image-upload.png"
import TextArea from "../atoms/TextArea";

interface Props {
    id: number;
    imagePath: string;
    testimonial: string;
    showDelete: boolean;
    onDelete: (id: number) => void;
    onSave: (id: number, imagePath: string, testimonial: string) => void;
    onCancel: () => void;
}

const EditTestimonialCard: FunctionComponent<Props> = (props: Props) => {
    const [testimonial, setTestimonial] = useState(props.testimonial);
    const [imagePath, setImagePath] = props.imagePath === "" ? useState(DefaultImage) : useState(props.imagePath);
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTestimonial(event.target.value);
    }
    const textAreaProps = {
        isErroneous: false,
        onChange: onChange,
        value: testimonial,
        placeholder: "",
        label: "Edit Client Story",
        maxNumChars: 400
    }

    const primaryBtnProps = {
        className: "update-button",
        text: "Update",
        onClick: () => props.onSave(props.id, imagePath, testimonial),
        copyText: ""
    }

    const secondaryBtnProps = {
        className: "cancel-button",
        text: "Cancel",
        onClick: () => props.onCancel(),
        copyText: ""
    }

    return (
        <div className="edit-testimonial-card">
            {/* image logic here */}
            <Row className="content">
                <Col>
                    <div className="image-upload">
                        <img className="base" src={imagePath}/>
                        <div className="overlay">
                            <img className="overlay-image" src={OverlayImage}/>
                            <p className="overlay-text">Add Photo</p>
                        </div>
                    </div>
                </Col>
                <Col className="text-and-submission">
                    <TextArea {...textAreaProps} />
                    <div className="buttons" >
                        <Button {...primaryBtnProps} />
                        <Button {...secondaryBtnProps} />
                        <i className="bi bi-trash" onClick={() => props.onDelete(props.id)} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default EditTestimonialCard;
