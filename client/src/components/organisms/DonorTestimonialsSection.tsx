import { gql, useQuery } from "@apollo/client";
import React, { FunctionComponent, useState } from "react";
import { TestimonialCarousel } from "../../data/types/donorHomepageConfig"
import TestimonialsCarousel from "../atoms/TestimonialsCarousel";

const DonorTestimonialsSection: FunctionComponent = () => {
    const [testimonials, setTestimonials] = useState<TestimonialCarousel | undefined>(undefined);
    const query = gql`
        query GetDonorHomepageTestimonialCarousel {
            donorHomepageTestimonialCarousel {
                testimonials {
                    id
                    testimonial
                    imagePath
                }
                interval
            }
        }
    `;

    const { error } = useQuery(query, {
        onCompleted: (data: { donorHomepageTestimonialCarousel: TestimonialCarousel }) => {
            const res = JSON.parse(JSON.stringify(data.donorHomepageTestimonialCarousel));
            const updateTestimonials = {
                ...res,
                interval: res.interval * 1000
            }
            setTestimonials(updateTestimonials);
        }
    });
    if (error) console.log(error.graphQLErrors);

    return (
        <div className="donor-testimonials-section">
            <h1 className="donor-testimonials-section-header">Meet Our Clients</h1>
            {testimonials != undefined && (
                <TestimonialsCarousel {...testimonials} />
            )}
        </div>
    );
};

export default DonorTestimonialsSection;
