import React, { FunctionComponent } from "react";
import AdminRequestGroupBrowser from '../components/organisms/AdminRequestGroupBrowser';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import DonorPage from '../components/layouts/DonorPage'
import HomepageBanner from '../components/organisms/HomepageBanner'

const AdminRequestGroupView: FunctionComponent = () => {
  return <Container className="donor-homepage" fluid>
    <DonorPage>
      <Row><HomepageBanner /></Row>
      <Row className="donor-homepage-request-groups-browser"><AdminRequestGroupBrowser /></Row>
    </DonorPage>
  </Container>;
};

export default AdminRequestGroupView;