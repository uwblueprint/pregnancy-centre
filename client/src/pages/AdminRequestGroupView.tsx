import React, { FunctionComponent } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import AdminPage from '../components/layouts/AdminPage'
import AdminRequestGroupBrowser from '../components/organisms/AdminRequestGroupBrowser';

const AdminRequestGroupView: FunctionComponent = () => {
  return <Container className="donor-homepage" fluid>
    <AdminPage>
      <Row className="donor-homepage"><AdminRequestGroupBrowser /></Row>
    </AdminPage>
  </Container>;
};

export default AdminRequestGroupView;
