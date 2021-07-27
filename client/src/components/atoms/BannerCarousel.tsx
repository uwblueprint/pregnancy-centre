import { Carousel, Container } from "react-bootstrap";
import React, { FunctionComponent } from "react";

interface Props {
    images: Array<string>;
    header: string;
    description: string;
    transitionInterval: number;
}

const BannerCarousel: FunctionComponent<Props> = (props: Props) => {
    return (
        <div className="banner-carousel">
            <Container fluid>
                <Carousel controls={false} interval={props.transitionInterval} indicators={false} className="carousel" fade>
                    {props.images.map((imgLink, index) => (
                        <Carousel.Item key={index}>
                            <img src={imgLink} />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
            <div className="col-md-6 banner-carousel-info">
                <h1>{props.header}</h1>
                <p>{props.description}</p>
            </div>
        </div>
    );
};

export default BannerCarousel;
