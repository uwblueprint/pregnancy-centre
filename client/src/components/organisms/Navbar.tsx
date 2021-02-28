import React, { FunctionComponent, useState } from "react";

import BsNavbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import tpcLogo from '../../assets/tpc-logo.svg'

const Navbar: FunctionComponent = () => {

  return <BsNavbar>
    <BsNavbar.Brand href="#home">
      <img
        src={tpcLogo}
        className="d-inline-block align-top logo"
        alt="React Bootstrap logo"
      />
    </BsNavbar.Brand>
    <div className="navbar-links">
      <Nav.Link href="#home">TPC Main Website</Nav.Link>
      <Nav.Link href="#link">How to Donate</Nav.Link>
      <Nav.Link href="#link">Organization Login</Nav.Link>
    </div>
  </BsNavbar>
};

export default Navbar;