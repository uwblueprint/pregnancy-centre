import React, { FunctionComponent } from "react";
import AdminRequestGroupBrowser from '../components/organisms/AdminRequestGroupBrowser';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import AdminPage from '../components/layouts/AdminPage'

const AdminRequestGroupView: FunctionComponent = () => {
  return <Container className="donor-homepage" fluid>
    <AdminPage>
      <Row className="donor-homepage"><AdminRequestGroupBrowser /></Row>
    </AdminPage>
  </Container>;
};

export default AdminRequestGroupView;
