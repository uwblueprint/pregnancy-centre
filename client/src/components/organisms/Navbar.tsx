import React, { FunctionComponent, useState } from "react";

import BsNavbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import tpcLogo from '../../assets/tpc-logo.svg'

const Navbar: FunctionComponent = () => {
  return <BsNavbar>
    <BsNavbar.Brand href="/">
      <img
        src={tpcLogo}
        className="d-inline-block align-top logo"
      />
    </BsNavbar.Brand>
    <div className="navbar-links">
      <Nav.Link href="https://pregnancycentre.ca/">TPC Main Website</Nav.Link>
      <Nav.Link href="/donation-guidelines">How to Donate</Nav.Link>
      <Nav.Link href="/login">Organization Login</Nav.Link>
    </div>
  </BsNavbar>
};

export default Navbar;