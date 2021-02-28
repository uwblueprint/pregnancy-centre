import React, { FunctionComponent } from "react";
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import tpcLogo from '../../assets/tpc-footer-logo.svg'

const Footer: FunctionComponent = () => {
  return <React.Fragment>
    <Container className="footer">
      <Row className="align-items-center">
        <Col>
          <img
            src={tpcLogo}
          />
        </Col>
      </Row>
    </Container>
  </React.Fragment>

};

export default Footer;
