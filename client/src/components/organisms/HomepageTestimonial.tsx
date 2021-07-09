import React, { FunctionComponent} from "react";
import { Row } from 'react-bootstrap';
import TestimonialCarousel from "../atoms/TestimonialCarousel";


const HomepageTestimonial: FunctionComponent = () => {
  return <div>
    <Row>
        <h1 className="donor-homepage-headers">Meet Our Clients</h1>
    </Row>
    <Row>
        <TestimonialCarousel/> 
    </Row>
  </div>
};

export default HomepageTestimonial;
