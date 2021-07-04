import React, { FunctionComponent } from "react";
import BannerCarousel from "../atoms/BannerCarousel";


const HomepageBanner: FunctionComponent = () => {
  return <div className="d-flex justify-content-center homepage-banner" >
    <BannerCarousel/>
    <div className="col-md-6 homepage-banner-info">
      <h1>Help women and families in Kitchener-Waterloo thrive with your donation today</h1>
      <p>Scroll to see our clients&#39; current needs and arrange a donation</p>
    </div>
  </div>
};

export default HomepageBanner;
