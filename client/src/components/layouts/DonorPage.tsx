import React, { FunctionComponent, useState } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import Footer from '../organisms/Footer'
import Navbar from '../organisms/Navbar'

interface Props {
  children: React.ReactNode
}

const DonorPage: FunctionComponent<Props> = (props: Props) => {
  return <div className="donor-page">
    <div className="donor-page-header"><Navbar /></div>
    <div className="donor-page-content" >{props.children}</div>
    <div className="donor-page-footer"><Footer /></div>
  </div>
};

export default DonorPage;
