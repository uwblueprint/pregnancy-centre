import {Carousel, Container} from 'react-bootstrap';
import React, { FunctionComponent } from "react";
import DonorHomepageConfig from '../../config/donorHompageConfig.json';


const BannerCarousel: FunctionComponent = () => {
    const bannerImgs = DonorHomepageConfig.Banner;
    const bannerIntv = 1000 * 10;
    return <Container fluid>
        <Carousel controls={false} interval={bannerIntv} indicators={false} className="banner-carousel" fade>
            {bannerImgs.map((imgLink, index) => (
                <Carousel.Item key={index}>
                    <img className="d-block w-100 banner-carousel" src={`${imgLink}`}/>
                </Carousel.Item>
                )
            )}
        </Carousel>
    </Container>
};

export default BannerCarousel;