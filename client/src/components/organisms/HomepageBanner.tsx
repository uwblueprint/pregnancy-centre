import React, { FunctionComponent } from "react";

import BannerPicture from "../../assets/homepage-banner.svg";
// import PacifierIcon from '../../assets/pacifier-icon.svg'
// import RubberDuckIcon from '../../assets/rubber-duck-icon.svg'
// import StrollerIcon from '../../assets/stroller-icon.svg'

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const HomepageBanner: FunctionComponent = () => {
    return (
        <div className="homepage-banner">
            <Row className="justify-content-between">
                <Col className="align-self-center homepage-banner-info" md={5}>
                    <h1>Help women and families in Kitchener-Waterloo thrive with your donation today</h1>
                    <p style={{ width: "80%" }}>Scroll to see our clients&#39; current needs and arrange a donation</p>
                    {/* <Row className="homepage-banner-stats">
          <Col className="homepage-banner-stat">
            <img className="homepage-banner-icon" src={StrollerIcon} />
            <h2>80+</h2>
            <p>regular donors</p>
          </Col>
          <Col className="homepage-banner-stat">
            <img className="homepage-banner-icon" src={PacifierIcon} />
            <h2>566</h2>
            <p>families helped</p>
          </Col>
          <Col className="homepage-banner-stat">
            <img className="homepage-banner-icon" src={RubberDuckIcon} />
            <h2>2932</h2>
            <p>items donated</p>
          </Col>
        </Row> */}
                </Col>
                <Col className="homepage-banner-image-container" md={5}>
                    <img className="homepage-banner-image" src={BannerPicture} />
                </Col>
            </Row>
        </div>
    );
};

export default HomepageBanner;
