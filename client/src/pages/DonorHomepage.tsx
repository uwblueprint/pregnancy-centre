import React, { FunctionComponent } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import DonorPage from '../components/layouts/DonorPage'
import DonorRequestGroupBrowser from '../components/organisms/DonorRequestGroupBrowser'
import HomepageBanner from '../components/organisms/HomepageBanner'
import SearchableDropdown from '../components/atoms/SearchableDropdown';
import Tag from '../components/atoms/Tag'

const DonorHomepage: FunctionComponent = () => {
  const onDropdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("dropdown change: " + event.target.value);
  }

  return <Container className="donor-homepage" fluid>
    <DonorPage>
      {/* TODO(ellen): this is testing code, delete before landing */}
      <SearchableDropdown
        initialText=""
        placeholderText="Select or create a type"
        searchPlaceholderText="Search for a type"
        noResultsText="This type does not exist"
        noResultsActionText="Create a new type"
        dropdownItems={["125mL", "225mL", "250mL", "500mL"]}
        isTagDropdown={true}
        isErroneous={false}
        isDisabled={false}
        onChange={onDropdownChange}
        onSelect={() => { }}
        noItemsAction={<Tag text="hello"></Tag>}
      />
      <SearchableDropdown
        initialText=""
        placeholderText="Select a group"
        searchPlaceholderText="Search for a group"
        noResultsText="This group does not exist"
        noResultsActionText="Create a new group"
        dropdownItems={["Bassinets", "Bottles", "Books", "Cribs", "Doorknobs"]}
        isErroneous={false}
        isDisabled={false}
        onChange={onDropdownChange}
        onSelect={() => { }}
        noItemsAction={Tag}
      />
      <Row><HomepageBanner /></Row>
      <Row className="donor-homepage-request-groups-browser"><DonorRequestGroupBrowser /></Row>
    </DonorPage>
  </Container>;
};

export default DonorHomepage;
