import React, { FunctionComponent, useContext, useState } from "react";
import { Button } from "../atoms/Button";
import EditTestimonialCard from "../atoms/EditTestimonialCard";
import { EditTestimonialsContext } from "../../pages/AdminEditTestimonialsPage";
import { Testimonial } from "../../data/types/donorHomepageConfig";
import TestimonialCard from "../atoms/TestimonialCard";

interface editState {
    isEditing: boolean;
    testimonialID: number;
}

const EditClientStoriesSection: FunctionComponent = () => {
    const { formState, setFormState } = useContext(EditTestimonialsContext);
    const testimonials = formState.donorHomepageConfig.testimonialCarousel.testimonials;
    const numTestimonials = testimonials.length;
    const [edit, setEdit] = useState<editState>({ isEditing: false, testimonialID: 0 });
    const [canDelete, setCanDelete] = useState(numTestimonials > 1);

    const resetEdit = () => {
        formState.editingClientStory = false;
        setEdit({ isEditing: false, testimonialID: 0 });
    };

    const cancelEdit = (id: number) => {
        const testimonial = testimonials[id - 1];
        if (testimonial.testimonial === "" || testimonial.imagePath === "") {
            testimonials.splice(id - 1, 1);
        }
        resetEdit();
    };

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
    };

    const updateTestimonial = (id: number, imagePath: string, testimonial: string) => {
        const updatedTestimonials = testimonials;
        updatedTestimonials[id - 1] = {
            ...updatedTestimonials[id - 1],
            imagePath: imagePath,
            testimonial: testimonial
        };
        setTestimonialCarousel(updatedTestimonials);
        resetEdit();
    };

    const selectTestimonial = (id: number) => {
        setEdit({ isEditing: true, testimonialID: id });
        formState.editingClientStory = true;
    };

    const deleteTestimonial = (id: number) => {
        const updatedTestimonials = testimonials;
        updatedTestimonials.splice(id - 1, 1);
        setTestimonialCarousel(updatedTestimonials);
        setCanDelete(numTestimonials > 1);
        resetEdit();
    };

    const addTestimonial = () => {
        const updatedTestimonials = testimonials;
        const newTestimonial = {
            id: numTestimonials + 1,
            imagePath: "",
            testimonial: ""
        };
        updatedTestimonials.push(newTestimonial);
        setCanDelete(numTestimonials > 1);
        setTestimonialCarousel(updatedTestimonials);
        setEdit({
            isEditing: true,
            testimonialID: newTestimonial.id
        });
    };

    return (
        <div className="edit-client-stories-section">
            <div className="header">
                <h1>Meet our Clients</h1>
                {numTestimonials < 5 && (
                    <Button
                        className={edit.isEditing ? "disabled" : ""}
                        text="+ Add another Client Story"
                        type="button"
                        copyText=""
                        onClick={addTestimonial}
                        disabled={edit.isEditing}
                    />
                )}
            </div>
            <p>Total: {numTestimonials}/5</p>
            {edit.isEditing ? (
                <EditTestimonialCard
                    {...testimonials[edit.testimonialID - 1]}
                    showDelete={canDelete}
                    onDelete={deleteTestimonial}
                    onCancel={cancelEdit}
                    onSave={updateTestimonial}
                />
            ) : (
                <div className="testimonials">
                    {testimonials.map((testimonial: Testimonial, index: number) => {
                        return (
                            <TestimonialCard
                                key={index}
                                {...testimonial}
                                showDelete={canDelete}
                                onEdit={selectTestimonial}
                                onDelete={deleteTestimonial}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EditClientStoriesSection;
