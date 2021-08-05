import React, { FunctionComponent } from "react";
import DonorHomepageConfig from "../../config/donorHomepageConfig.json";
import TestimonialsCarousel from "../atoms/TestimonialsCarousel"

const DonorTestimonialsSection: FunctionComponent = () => {
    const testimonialsInterval = DonorHomepageConfig.testimonialCarousel.interval;
    const testimonials = DonorHomepageConfig.testimonialCarousel.testimonials;
    return (
        <div className="donor-testimonials-section">
            <h1 className="donor-testimonials-section-header">
                Meet Our Clients
            </h1>
            <TestimonialsCarousel
                transitionInterval={testimonialsInterval}
                testimonials={testimonials}
            />
        </div>
    );
}

export default DonorTestimonialsSection;