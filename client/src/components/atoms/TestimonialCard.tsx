import React, { FunctionComponent } from "react";

interface Props {
    id: number;
    imagePath: string;
    testimonial: string;
    showDelete: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const TestimonialCard: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="testimonial-card">
            <img src={props.imagePath} />
            <p className="text">{props.testimonial}</p>
            <div className="action-icons">
                <i className="bi bi-pencil" onClick={() => props.onEdit(props.id)} />
                {props.showDelete && <i className="bi bi-trash" onClick={() => props.onDelete(props.id)} />}
            </div>
        </div>
    );
};

export default TestimonialCard;
