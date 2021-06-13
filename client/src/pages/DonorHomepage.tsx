import React, { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import DonorImpactSection from "../components/organisms/DonorImpactSection";
import DonorPage from "../components/layouts/DonorPage";
import DonorRequestGroupBrowser from "../components/organisms/DonorRequestGroupBrowser";
import HomepageBanner from "../components/organisms/HomepageBanner";

const DonorHomepage: FunctionComponent = () => {
    return (
        <Container className="donor-homepage" fluid>
            <DonorPage>
                <Row>
                    <HomepageBanner />
                </Row>
                <Row className="donor-homepage-request-groups-browser">
                    <DonorRequestGroupBrowser />
                </Row>
                <Row className="donor-homepage-request-groups-browser">
                    <DonorImpactSection />
                </Row>
            </DonorPage>
        </Container>
    );
};

export default DonorHomepage;
