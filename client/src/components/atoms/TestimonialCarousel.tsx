import {Carousel, Col, Container, Row} from 'react-bootstrap';
import React, { FunctionComponent } from "react";
import DonorHomepageConfig from '../../config/donorHompageConfig.json';

const BannerCarousel: FunctionComponent = () => {
    const testimonialImgs = DonorHomepageConfig.Testimonials;
    const testimonialIntv = 1000 * 10;
    return <Container className="testimonial-container" fluid>
        <Carousel controls={false} interval={testimonialIntv} className="testimonial-carousel">
            {testimonialImgs.map((testimonial, index) => (
                <Carousel.Item key={index}>
                    <Row sm={12}>
                        <Col md={{span:6}}>
                            <img src={`${testimonial.image}`}></img>
                        </Col>    
                        <Col md={{span:6}}>
                            <p>{testimonial.quote}</p>
                        </Col>
                    </Row>
                </Carousel.Item>
                )
            )}
        </Carousel>
    </Container>
};

export default BannerCarousel;