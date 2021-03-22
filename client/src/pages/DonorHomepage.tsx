import React, { FunctionComponent } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import SearchBar from "../components/atoms/SearchBar";

import DonorPage from '../components/layouts/DonorPage'
import DonorRequestGroupBrowser from '../components/organisms/DonorRequestGroupBrowser'
import HomepageBanner from '../components/organisms/HomepageBanner'
import EmailConfirmedModal from "./EmailConfirmedModal";

const DonorHomepage: FunctionComponent = () => {
    const onSearchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("yay!");
        console.log(event.target.value);
    }

  return <Container className="donor-homepage" fluid>
    <DonorPage>
      <Row><HomepageBanner /></Row>
      <Row className="donor-homepage-request-groups-browser"><DonorRequestGroupBrowser /></Row>
      <SearchBar defaultText="Search for a group..." onSearchStringChange={onSearchStringChange}></SearchBar>
    </DonorPage>
  </Container>;
};

export default DonorHomepage;
