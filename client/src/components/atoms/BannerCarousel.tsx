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
            <Container fluid className="banner-carousel-container">
                <Carousel controls={false} interval={props.transitionInterval} indicators={false} fade>
                    {props.images.map((imgLink, index) => (
                        <Carousel.Item key={index}>
                            <img src={imgLink} />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
            <div className="col-sm-10 col-lg-8 banner-carousel-info">
                <h1>{props.header}</h1>
                <p>{props.description}</p>
            </div>
        </div>
    );
};

export default BannerCarousel;
