import React, { FunctionComponent } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import DonorPage from '../components/layouts/DonorPage'
import DonorRequestGroupBrowser from '../components/organisms/DonorRequestGroupBrowser'
import HomepageBanner from '../components/organisms/HomepageBanner'
// TODO(ellen): this is testing code, delete before landing
import SearchableDropdown from '../components/atoms/SearchableDropdown';
import { Tag } from '../components/atoms/Tag';

const DonorHomepage: FunctionComponent = () => {
  const onDropdownChange = () => {}
  return <Container className="donor-homepage" fluid>
    <DonorPage>
      {/* TODO(ellen): this is testing code, delete before landing */}
      <SearchableDropdown
        initialText=""
        placeholderText="Select a group"
        searchPlaceholderText="Search for a group"
        noResultsText="This group does not exist"
        noResultsActionText="Create a new group"
        dropdownItemsText={["Bassinets", "Bottles", "Books", "Cribs", "Doorknobs"]}
        isErroneous={false}
        isDisabled={false}
        onChange={onDropdownChange}
        onSelect={(str: string) => {}}
        noItemsAction={Tag}
      />
      <SearchableDropdown
        initialText=""
        placeholderText="Select or create a type"
        searchPlaceholderText="Search for a type"
        noResultsText="This type does not exist"
        noResultsActionText="Create a new type"
        dropdownItemsText={[]}
        dropdownTags={[{text: "125mL"}, {text: "225mL"}, {text: "250mL"}, {text: "500mL"}]}
        isErroneous={false}
        isDisabled={false}
        onChange={onDropdownChange}
        onSelect={(str: string) => {}}
        noItemsAction={Tag}
      />
      <Row><HomepageBanner /></Row>
      <Row className="donor-homepage-request-groups-browser"><DonorRequestGroupBrowser /></Row>
    </DonorPage>
  </Container>;
};

export default DonorHomepage;
