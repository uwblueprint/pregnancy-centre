import React, { FunctionComponent } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import DonorPage from '../components/layouts/DonorPage'
import DonorRequestGroupBrowser from '../components/organisms/DonorRequestGroupBrowser'
import HomepageBanner from '../components/organisms/HomepageBanner'
// TODO(ellen): this is testing code, delete before landing
import SearchableDropdown from '../components/atoms/SearchableDropdown';
import Tag from '../components/atoms/Tag';

const DonorHomepage: FunctionComponent = () => {
  // TODO(ellen): this is testing code, delete before landing
  const onDropdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("dropdown change: " + event.target.value);
  }

  return <Container className="donor-homepage" fluid>
    <DonorPage>
      {/* TODO(ellen): this is testing code, delete before landing */}
      <SearchableDropdown
        placeholderText="Select a group"
        searchPlaceholderText="Search for a group"
        dropdownItemsText={["Bassinets", "Bottles", "Books", "Cribs", "Doorknobs"]}
        isErroneous={false}
        onChange={onDropdownChange}
      />
      <SearchableDropdown
        placeholderText="Select or create a type"
        searchPlaceholderText="Search for a type"
        dropdownItemsText={["125mL", "250mL", "500mL"]}
        dropdownItems={[<Tag small text="125mL" key="125mL"/>, <Tag small text="250mL" key="250mL"/>, <Tag small text="500mL" key="500mL"/>]}
        isErroneous={false}
        onChange={onDropdownChange}
      />
      <Row><HomepageBanner /></Row>
      <Row className="donor-homepage-request-groups-browser"><DonorRequestGroupBrowser /></Row>
    </DonorPage>
  </Container>;
};

export default DonorHomepage;
