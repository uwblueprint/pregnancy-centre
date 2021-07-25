import React, { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Banner from "../components/organisms/Banner";
import DonorImpactSection from "../components/organisms/DonorImpactSection";
import DonorPage from "../components/layouts/DonorPage";
import DonorRequestGroupBrowser from "../components/organisms/DonorRequestGroupBrowser";

const DonorHomepage: FunctionComponent = () => {
    return (
        <Container className="donor-homepage" fluid>
            <DonorPage>
                <Row>
                    <Banner />
                </Row>
                <Row className="donor-homepage-request-groups-browser">
                    <DonorRequestGroupBrowser />
                </Row>
                <Row className="donor-homepage-donor-impact-section">
                    <DonorImpactSection />
                </Row>
            </DonorPage>
        </Container>
    );
};

export default DonorHomepage;
