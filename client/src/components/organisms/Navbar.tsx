import React, { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";

import BsNavbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import tpcLogo from "../../assets/tpc-logo.svg";
import UnseenDot from "../atoms/UnseenDot";

type Link = {
    name: string;
    path: string;
    isEmphasized?: boolean;
};

interface Props {
    leftLinks: Link[];
    rightLinks: Link[];
}

const Navbar: FunctionComponent<Props> = (props: Props) => {
    const location = useLocation();
    const getLinksJSX = (links: Link[]) =>
        links.map((link: Link) => (
            <Nav.Link className={link.path === location.pathname ? "active" : ""} href={link.path} key={link.name}>
               {link.isEmphasized? <><UnseenDot /><div style={{marginLeft:10}}>{link.name}</div></> : link.name}
            </Nav.Link>
        ));

    return (
        <BsNavbar>
            <BsNavbar.Brand href="/">
                <img src={tpcLogo} className="d-inline-block align-top logo" />
            </BsNavbar.Brand>
            <div className="navbar-links">
                <div className="left">{getLinksJSX(props.leftLinks)}</div>
                <div className="right">{getLinksJSX(props.rightLinks)}</div>
            </div>
        </BsNavbar>
    );
};

export default Navbar;
