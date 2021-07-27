import React, { FunctionComponent } from "react";
import BannerCarousel from "../atoms/BannerCarousel";
import DonorHomepageConfig from "../../config/donorHomepageConfig.json";

const DonorHomepageBanner: FunctionComponent = () => {
    const bannerImgs = DonorHomepageConfig.banner.images;
    const bannerHeader = DonorHomepageConfig.banner.header;
    const bannerDesc = DonorHomepageConfig.banner.description;
    const bannerIntv = DonorHomepageConfig.banner.interval * 1000;
    return (
        <BannerCarousel
            images={bannerImgs}
            header={bannerHeader}
            description={bannerDesc}
            transitionInterval={bannerIntv}
        />
    );
};

export default DonorHomepageBanner;
