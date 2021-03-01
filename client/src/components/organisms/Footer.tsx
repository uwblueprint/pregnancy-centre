import React, { FunctionComponent } from "react";
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import facebookLogo from '../../assets/facebook-logo.svg'
import tpcLogo from '../../assets/tpc-footer-logo.svg'
import twitterLogo from '../../assets/twitter-logo.svg'

const Footer: FunctionComponent = () => {
  return <React.Fragment>
    <Container className="footer" fluid>
      <Row className="org-info">
        <Col><img src={tpcLogo} /></Col>
        <Col>
          <h1>THE PREGNANCY CENTRE</h1>
          <p>38 Francis St S, Kitchener, ON</p>
          <p>519-886-4001</p>
          <p>info@thepregnancycentre.ca</p>
        </Col>
        <Col>
          <h1>HOURS</h1>
          <p>MONDAY to THURSDAY</p>
          <p>9:00am – 4:00pm</p>
        </Col>
        <Col>
          <h1>CONTACT</h1>
          <p>PHONE: 519.886.4001</p>
          <p>TEXT: 519.504.4411</p>
          <p>EMAIL: info@pregnancycentre.ca</p>
        </Col>
      </Row>
      <Row className="align-items-center footer-social-media-links">
        <h1>© 2021 The Pregnancy Centre</h1>
        <a href="https://twitter.com/kwprc?lang=en"><img src={twitterLogo} /></a>
        <a href="https://www.facebook.com/KWTPC/"><img src={facebookLogo} /></a>
      </Row>
    </Container>
  </React.Fragment>

};

export default Footer;
