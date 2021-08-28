import { Button, ButtonProps} from "../atoms/Button";
//import { Col, Row } from "react-bootstrap";
import React, { FunctionComponent, useContext, useState } from "react";
import { EditTestimonialsContext } from "../../pages/AdminEditTestimonialsPage";
import { Testimonial } from "../../data/types/donorHomepageConfig";

interface edit {
    isEditing: boolean;
    testimonialID: number;
}

const EditClientStoriesSection: FunctionComponent = () => {
    const { formState, setFormState } = useContext(EditTestimonialsContext);
    const [edit, setEdit] = useState<edit>({isEditing: false, testimonialID: 0});
    const getNumTestimonials = () => {
        return formState.donorHomepageConfig.testimonialCarousel.testimonials.length;
    }
    const getTestimonials = () => {
        return formState.donorHomepageConfig.testimonialCarousel.testimonials;
    }
    const resetEdit = () => {
        setEdit({isEditing: false, testimonialID: 0});
    }
    const setTestimonialCarousel = (testimonials: Array<Testimonial>) => {
        setFormState({
            ...formState,
            donorHomepageConfig: {
                ...formState.donorHomepageConfig,
                testimonialCarousel: {
                    ...formState.donorHomepageConfig.testimonialCarousel,
                    testimonials: testimonials
                }
            }
        });
    }

    // functions needed
        // add new testimonial
        // delete testimonial
        // edit tesitmonial

    const editTestimonial = (id : number, imagePath: string, testimonial: string) => {
        const updatedTestimonials = getTestimonials();
        updatedTestimonials[id - 1] = {
            ...updatedTestimonials[id - 1],
            imagePath: imagePath,
            testimonial: testimonial
        }
        setTestimonialCarousel(updatedTestimonials);
        resetEdit();
    }

    const deleteTestimonial = (id : number) => {
        const updatedTestimonials = getTestimonials();
        updatedTestimonials.splice(id - 1, 1);
        setTestimonialCarousel(updatedTestimonials);
        resetEdit();
    }

    const addTestimonial = () => {
        const updatedTestimonials = getTestimonials();
        const newTestimonial = {
            id: getNumTestimonials() + 1,
            imagePath: "",
            testimonial: ""
        }
        updatedTestimonials.push(newTestimonial);
        setTestimonialCarousel(updatedTestimonials);
        setEdit({
            isEditing: true,
            testimonialID: newTestimonial.id
        });
    }

    return (
        <div className="edit-client-stories-section">
            <div className="header">
                <h1>Meet our Clients</h1>
                <Button text="+ Add another Client Story" type="button" copyText="" disabled={getNumTestimonials() == 5}/>
            </div>
            <p>Total: {getNumTestimonials()}/5</p>
            {/* 
                - if edit mode on, then show edit card of that testimonial
                    - cancel will turn edit mode off
                - if edit mode off, then show all testimonials (map)
                    - edit onClick
                    - trash onClick will just update 
            */}
        </div>
    )
};

export default EditClientStoriesSection;