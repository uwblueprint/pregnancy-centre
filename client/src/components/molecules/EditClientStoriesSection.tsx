import { Button, ButtonProps} from "../atoms/Button";
//import { Col, Row } from "react-bootstrap";
import React, { FunctionComponent, useContext, useState } from "react";
import { EditTestimonialsContext } from "../../pages/AdminEditTestimonialsPage";


const EditClientStoriesSection: FunctionComponent = () => {
    const { formState, setFormState } = useContext(EditTestimonialsContext);
    
    const setTestimonialCarousel = () => {
    }

    // not sure if this will happen in async and won't show up
    const [testimonials, setTestimonials] = useState(formState.donorHomepageConfig.testimonialCarousel.testimonials);

    const addNewStoryButtonProps = {
        className: "edit-client-stories-section tertiary-button",
        disabled: false,
        text: "Add another Client Story",
        onClick: () => {
            // smth adding a new story
        },
        copyText: ""
    }

    return (
        <div className="edit-client-stories-section">
            <div>
                <h1>Meet our Clients</h1>
                <Button text="Add another Client Story" type="button" copyText="" disabled={false}/>
            </div>
            <p>Total: {} </p>
        </div>
    )
};

export default EditClientStoriesSection;