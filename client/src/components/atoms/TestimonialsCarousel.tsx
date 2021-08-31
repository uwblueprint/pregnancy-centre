import { Carousel, Col, Container, Row } from "react-bootstrap";
import React, { FunctionComponent } from "react";
interface Props {
    testimonials: Array<Testimonial>;
    interval: number;
}

interface Testimonial {
    imagePath: string;
    testimonial: string;
}

const TestimonialsCarousel: FunctionComponent<Props> = (props: Props) => {
    return (
        <Container className="testimonials-carousel" fluid>
            <Carousel controls={false} interval={props.interval} className="carousel">
                {props.testimonials.map((testimonial, index) => (
                    <Carousel.Item key={index}>
                        <Row sm={12}>
                            <Col md={12} lg={6}>
                                <img src={testimonial.imagePath}></img>
                            </Col>
                            <Col md={12} lg={6} className="my-auto">
                                <p>{"\"" + testimonial.testimonial + "\""}</p>
                            </Col>
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};

export default TestimonialsCarousel;
