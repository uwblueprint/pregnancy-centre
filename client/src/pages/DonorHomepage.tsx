import React, { FunctionComponent, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import DonorHomepageBanner from "../components/organisms/DonorHomepageBanner";
import DonorImpactSection from "../components/organisms/DonorImpactSection";
import DonorPage from "../components/layouts/DonorPage";
import DonorRequestGroupBrowser from "../components/organisms/DonorRequestGroupBrowser";
import DonorTestimonialsSection from "../components/organisms/DonorTestimonialsSection";

import MobilePopup from "../components/atoms/MobilePopup";
import tpcLogo from "../assets/tpc-logo.svg";

const DonorHomepage: FunctionComponent = () => {
    const [showMobilePopup, setShowMobilePopup] = useState(true);
    const handleClose = () => setShowMobilePopup(false);
    const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);

    const breakpoint = 576;

    React.useEffect(() => {
        const handleWindowResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleWindowResize);
        setShowMobilePopup(screenWidth < breakpoint);
    }, []);
    return (
        <>
        <Container className="donor-homepage" fluid>
            <DonorPage>
                <Row className="donor-homepage-banner">
                    <DonorHomepageBanner />
                </Row>
                <Row className="donor-homepage-request-groups-browser">
                    <DonorRequestGroupBrowser />
                </Row>
                <Row className="donor-homepage-testimonials-section">
                    <DonorTestimonialsSection />
                </Row>
                <Row className="donor-homepage-donor-impact-section">
                    <DonorImpactSection />
                </Row>
            </DonorPage>
        </Container>
        <MobilePopup
            className="mobile-popup"
            show={showMobilePopup}
            handleClose={handleClose}
            header={<img src={tpcLogo} />}
        ></MobilePopup>
    </>
    );
};

export default DonorHomepage;
