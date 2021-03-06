import React, { FunctionComponent } from "react";
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import DonorPage from '../components/layouts/DonorPage'
import DonorRequestGroupView from '../components/organisms/DonorRequestGroupView'
import HomepageBanner from '../components/organisms/HomepageBanner'

const DonorHomepage: FunctionComponent = () => {
  return <Container className="donor-homepage" fluid>
    <DonorPage>
      <Row><HomepageBanner /></Row>
      <Row className="donor-homepage-request-groups-view"><DonorRequestGroupView /></Row>
    </DonorPage>
  </Container>;
};

export default DonorHomepage;
