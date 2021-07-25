import { Carousel, Container } from "react-bootstrap";
import React, { FunctionComponent } from "react";
import DonorHomepageConfig from "../../config/donorHomepageConfig.json";

interface Props {
    bannerImgs: Array<string>;
    bannerHeader: string;
    bannerDesc: string;
}

const BannerCarousel: FunctionComponent<Props> = (props: Props) => {
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
                <h1>{props.bannerHeader}</h1>
                <p>{props.bannerDesc}</p>
            </div>
        </div>
    );
};

export default BannerCarousel;
