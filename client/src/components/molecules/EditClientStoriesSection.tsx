import { Button, ButtonProps} from "../atoms/Button";
//import { Col, Row } from "react-bootstrap";
import React, { FunctionComponent, useContext, useState } from "react";
import EditTestimonialCard from "../atoms/EditTestimonialCard";
import { EditTestimonialsContext } from "../../pages/AdminEditTestimonialsPage";
import { Testimonial } from "../../data/types/donorHomepageConfig";
import TestimonialCard from "../atoms/TestimonialCard";

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
    const [canDelete, setCanDelete] = useState(getNumTestimonials() > 1);
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

    const updateTestimonial = (id : number, imagePath: string, testimonial: string) => {
        const updatedTestimonials = getTestimonials();
        updatedTestimonials[id - 1] = {
            ...updatedTestimonials[id - 1],
            imagePath: imagePath,
            testimonial: testimonial
        }
        setTestimonialCarousel(updatedTestimonials);
        resetEdit();
    }

    const selectTestimonial = (id: number) => {
        setEdit({isEditing: true, testimonialID: id});
    }

    const deleteTestimonial = (id : number) => {
        const updatedTestimonials = getTestimonials();
        updatedTestimonials.splice(id - 1, 1);
        setTestimonialCarousel(updatedTestimonials);
        setCanDelete(getNumTestimonials() > 1);
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
        setCanDelete(getNumTestimonials() > 1);
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
                {getNumTestimonials() < 5 && (<Button text="+ Add another Client Story" type="button" copyText="" onClick={addTestimonial}/>)}
            </div>
            <p>Total: {getNumTestimonials()}/5</p>
            { edit.isEditing ? 
                (<EditTestimonialCard {...getTestimonials()[edit.testimonialID - 1]} showDelete={canDelete} onDelete={deleteTestimonial} onCancel={resetEdit} onSave={updateTestimonial}/>)
            : 
                (<div className="testimonials">
                    {getTestimonials().map((testimonial: Testimonial, index: number) => {
                        return (
                            <TestimonialCard key={index} {...testimonial} showDelete={canDelete} onEdit={selectTestimonial} onDelete={deleteTestimonial}/>
                        )
                    })}
                </div>)
            }
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