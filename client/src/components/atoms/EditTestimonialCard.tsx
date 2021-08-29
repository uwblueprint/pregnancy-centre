import { Col, Row } from "react-bootstrap";
import React, { FunctionComponent, useState } from "react";
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
    return (
        <div className="edit-testimonial-card">
            {/* image logic here */}
            <Row>
                <Col></Col>
                <Col></Col>
            </Row>
            <div className="text-editor">
                <h3 className="header">Edit Client Story</h3>
            </div>
        </div>
    );
};

export default EditTestimonialCard;
