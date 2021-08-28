import React, { FunctionComponent,  useState } from "react";

interface Props {
    id : number;
    imagePath: string;
    testimonial: string;
    showDelete: boolean;
    onDelete: (id: number) => void;
    onSave: (id: number, imagePath: string, testimonial: string) => void;
    onCancel: () => void;
}

const EditTestimonialCard: FunctionComponent<Props> = (props) => {

    return (
        <div className="edit-testimonial-card">
            
        </div>
    )
}

export default EditTestimonialCard;