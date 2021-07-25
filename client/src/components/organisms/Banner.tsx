import React, { FunctionComponent } from "react";
import BannerCarousel from "../atoms/BannerCarousel";
import DonorHomepageConfig from "../../config/donorHomepageConfig.json";

const Banner: FunctionComponent = () => {
    const bannerImgs = DonorHomepageConfig.Banner.images;
    const bannerHeader = DonorHomepageConfig.Banner.header;
    const bannerDesc = DonorHomepageConfig.Banner.description;
    const bannerIntv = DonorHomepageConfig.Banner.interval;
    return (
        <BannerCarousel
            bannerImgs={bannerImgs}
            bannerHeader={bannerHeader}
            bannerDesc={bannerDesc}
            bannerIntv={bannerIntv}
        />
    );
};

export default Banner;
