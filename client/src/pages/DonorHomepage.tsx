import React, { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import DonorHomepageBanner from "../components/organisms/DonorHomepageBanner";
import DonorImpactSection from "../components/organisms/DonorImpactSection";
import DonorPage from "../components/layouts/DonorPage";
import DonorRequestGroupBrowser from "../components/organisms/DonorRequestGroupBrowser";
import DonorTestimonialsSection from "../components/organisms/DonorTestimonialsSection";

const DonorHomepage: FunctionComponent = () => {
    return (
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
    );
};

export default DonorHomepage;
