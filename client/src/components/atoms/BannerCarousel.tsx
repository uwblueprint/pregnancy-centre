import { Carousel, Container } from "react-bootstrap";
import React, { FunctionComponent } from "react";
import DonorHomepageConfig from "../../config/donorHompageConfig.json";

const BannerCarousel: FunctionComponent = () => {
    const bannerImgs = DonorHomepageConfig.Banner;
    const bannerIntv = 1000 * 10;
    return (
        <div className="homepage-banner">
            <Container fluid>
                <Carousel controls={false} interval={bannerIntv} indicators={false} className="banner-carousel" fade>
                    {bannerImgs.map((imgLink, index) => (
                        <Carousel.Item key={index}>
                            <img className="banner-carousel" src={`${imgLink}`} />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Container>
            <div className="col-md-6 homepage-banner-info">
                <h1>Help women and families in Kitchener-Waterloo thrive with your donation today</h1>
                <p>Scroll to see our clients&#39; current needs and arrange a donation</p>
            </div>
        </div>
    );
};

export default BannerCarousel;
