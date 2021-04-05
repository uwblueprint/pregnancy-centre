import React, { FunctionComponent } from "react";

import BsNavbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import tpcLogo from '../../assets/tpc-logo.svg'

type Link = {
  name: string,
  link: string
}

interface Props {
  links: Link[]
}

const Navbar: FunctionComponent<Props> = (props: Props) => {
  return <BsNavbar>
    <BsNavbar.Brand href="/">
      <img
        src={tpcLogo}
        className="d-inline-block align-top logo"
      />
    </BsNavbar.Brand>
    <div className="navbar-links">
      {props.links.map((link : Link) => {
        return <Nav.Link href={link.link} key={link.name}>{link.name}</Nav.Link>
      })}
    </div>
  </BsNavbar>
};

export default Navbar;
